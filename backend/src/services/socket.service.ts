import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { GroupChat } from 'src/schemas/chat.schema';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(GroupChat.name) private readonly chatModel: Model<GroupChat>,
  ) {}

  async getUserGroups(userId: string) {
    // const user = await this.userModel.findById(userId);
    return await this.chatModel
      .find({ participants: userId }) // Match userId in participants array
      .select('_id'); // Select only necessary fields (_id and groupName)
  }
}
