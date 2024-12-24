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
    const newMessage = await this.messageModel.create({
      sender,
      message,
      groupId,
      status,
    });
    return newMessage;
  }

  async getAllMessages(groupId: string, userId: string) {
    if (!groupId || !userId) {
      throw new NotFoundException('Group ID and User ID are required');
    }

    const messages = await this.messageModel
      .find({ groupId })
      .sort({ createdAt: 1 });

    const chat = await this.chatModel.findById(groupId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

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
}
