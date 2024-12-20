import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroupChat } from 'src/schemas/chat.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(GroupChat.name) private readonly chatModel: Model<GroupChat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createGroupChat({
    groupName,
    participants,
  }: {
    groupName: string;
    participants: string[];
  }) {
    try {
      const groupchat = new this.chatModel({ groupName, participants });
      await groupchat.save();

      const participantsDetails = await this.userModel
        .find({ _id: { $in: groupchat.participants } })
        .select('_id username');

      console.log('participantsDetails', participantsDetails);

      const data = {
        _id: groupchat._id,
        groupName: groupchat.groupName,
        participants: participantsDetails,
      };

      return data;
    } catch (error) {}
  }

  async allChats(userId: string) {
    try {
      const chats = await this.chatModel
        .find({ participants: userId }) // Match userId in participants array
        .select('_id groupName'); // Select only necessary fields (_id and groupName)

      return chats;

    } catch (error) {}
  }
}
