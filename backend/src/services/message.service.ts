import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from 'src/schemas/message.schema';
import { Chat } from 'src/schemas/chat.schema';
import { SocketService } from './socket.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly socketService: SocketService,
  ) {}

  async createMessage({
    sender,
    message,
    groupId,
    status,
  }: {
    sender: string;
    message: {
      type: string;
      content: string; // The actual content (text or file URL)
      format?: string; // Optional format for files (e.g., "jpg", "pdf")
    };
    groupId: string;
    status: string;
  }) {
    return await this.messageModel.create({
      sender,
      message,
      groupId,
      status,
    });
  }

  async getAllMessages(groupId: string, userId: string) {
    let messages = await this.messageModel
      .find({ groupId })
      .sort({ createdAt: 1 });

    const chat = await this.chatModel.findById(groupId);

    // get broadcast messages
    if (chat.type === 'one-to-one') {
      // Step 1: Find a one-to-one chat with the exact same participants
      const broadcastChat = await this.chatModel.findOne({
        participants: {
          $in: userId,
        },
        senderId: {
          $in: chat.participants.filter(
            ({ _id }) => _id !== new Types.ObjectId(userId),
          ),
        },
      });

      if (broadcastChat) {
        const broadcastMessages = await this.messageModel.find({
          groupId: broadcastChat._id.toString(),
        });

        messages = messages.concat(broadcastMessages);
      }
    }

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // update status to seen
    if (chat.type === 'one-to-one') {
      const unseenMessages = messages.filter(
        (message) =>
          message.sender !== new Types.ObjectId(userId) &&
          message.status !== 'seen',
      );

      if (unseenMessages.length > 0) {
        await Promise.all(
          unseenMessages.map(async (message) => {
            message.status = 'seen';
            await message.save();
            this.socketService
              .getServer()
              .to(groupId)
              .emit('messageSeenByUser', message);
          }),
        );
      }
    }

    // update status to read
    if (chat.type === 'group') {
      const messagesToUpdate = messages.filter(
        (message) =>
          message.sender.toString() !== userId &&
          (!message.readBy || !message.readBy.includes(userId)),
      );

      if (messagesToUpdate.length > 0) {
        await Promise.all(
          messagesToUpdate.map(async (message) => {
            if (!message.readBy) {
              message.readBy = [];
            }
            message.readBy.push(userId);
            await message.save();

            this.socketService
              .getServer()
              .to(groupId)
              .emit('messageReadByUser', {
                messageId: message._id,
                readerId: userId,
              });
          }),
        );
      }
    }

    return messages;
  }

  async updateMessageStatus({
    messageId,
    status,
  }: {
    messageId: string;
    status: string;
  }) {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      { status },
      { new: true },
    );

    if (!updatedMessage) {
      throw new NotFoundException('Message not found');
    }

    return updatedMessage;
  }

  async updateMessageReadBy({
    messageId,
    userId,
  }: {
    messageId: string;
    userId: string;
  }) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    message.readBy.push(userId);
    await message.save();
  }

  async createBroadcastMessage({
    groupId,
    message,
    sender,
  }: {
    groupId: string;
    message: {
      type: string;
      content: string;
      format?: string;
    };
    sender: string;
  }) {
    const newMessage = await this.messageModel.create({
      sender,
      message,
      groupId, // here we are putting broadcast id as group id but not creating group room
    });

    const chat = await this.chatModel.findById(groupId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    chat.participants.forEach((participant) => {
      this.socketService
        .getServer()
        .to(participant.toString())
        .emit('broadcastMessage', newMessage);
    });

    return newMessage;
  }
}
