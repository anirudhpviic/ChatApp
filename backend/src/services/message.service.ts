import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage({
    groupName,
    sender,
    content,
    groupId,
  }: {
    groupName: string;
    sender: string;
    content: string;
    groupId: string;
  }) {
    const message = new this.messageModel({
      groupName,
      sender,
      content,
      groupId,
    });
    await message.save();
    return message;
  }
}
