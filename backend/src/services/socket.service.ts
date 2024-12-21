import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async getUserGroups(userId: string) {
    // const user = await this.userModel.findById(userId);
    return await this.chatModel
      .find({ participants: userId }) // Match userId in participants array
      .select('_id'); // Select only necessary fields (_id and groupName)
  }
}
