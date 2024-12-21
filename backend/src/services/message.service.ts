import { Injectable } from '@nestjs/common';
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
  }: {
    sender: string;
    message: string;
    groupId: string;
  }) {
    const newMessage = new this.messageModel({
      sender,
      message,
      groupId,
      status: 'send',
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
}