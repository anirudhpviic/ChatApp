import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/schemas/message.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
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

  async getAllMessages(groupId) {
    // const messages = await this.messageModel.find({groupId});
    // console.log(messages);
    const messages = await this.messageModel.find({ groupId });
    // .sort({ createdAt: 1 });
    // .exec();

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
