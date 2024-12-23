import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/schemas/message.schema';
import { Model, Types } from 'mongoose';
import { SocketService } from './socket.service';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly socketService: SocketService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async createMessage({
    sender,
    message,
    groupId,
    status,
  }: {
    sender: string;
    message: string;
    groupId: string;
    status: string;
  }) {
    const newMessage = new this.messageModel({
      sender,
      message,
      groupId,
      status,
    });
    await newMessage.save();
    return newMessage;
  }

  async getAllMessages(groupId,userId) {
    // const messages = await this.messageModel.find({groupId});
    // console.log(messages);
    const messages = await this.messageModel.find({ groupId });
    // .sort({ createdAt: 1 });
    // .exec();

    const chat = await this.chatModel.findById(groupId);

    const server = this.socketService.getServer();

    if (chat.type === 'one-to-one') {
      // If the chat is one-to-one and the current user is not the sender, update status to "seen"
      for (const message of messages) {
        if (message.sender !== userId && message.status !== 'seen') {
          message.status = 'seen';
          await message.save();

          server.to(groupId).emit('messageSeenByUser', message);
        }
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
    const updatedMessage = await this.messageModel.findOneAndUpdate(
      { _id: messageId }, // Filter criteria
      { status }, // Update fields
      { new: true }, // Return the updated document
    );

    if (!updatedMessage) {
      throw new NotFoundException('Message not found or group mismatch');
    }

    return updatedMessage;
  }
}
