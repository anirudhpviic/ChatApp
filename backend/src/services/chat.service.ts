import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';
import { User } from 'src/schemas/user.schema';
import { SocketService } from './socket.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly socketService: SocketService,
  ) {}

  async createChat({
    groupName,
    participants,
    type,
    userId,
  }: {
    groupName?: string;
    participants: Types.ObjectId[];
    type: 'one-to-one' | 'group';
    userId: Types.ObjectId;
  }) {
    // Prepare chat data
    const chatData: Partial<Chat> = { type, participants };
    if (type === 'group') chatData.groupName = groupName;

    // Create the chat
    const chat = await this.chatModel.create(chatData);

    // Fetch participant details
    const participantDetails = await this.userModel
      .find({ _id: { $in: participants } })
      .select('_id username');

    // Join the chat room for each participant
    participants.forEach((participantId) => {
      if (participantId === userId) return;
      this.socketService
        .getServer()
        .to(participantId.toString())
        .emit('joinChatRoom', chat._id.toString());
    });

    return {
      _id: chat._id,
      type: chat.type,
      ...(chat.type === 'group' && { groupName: chat.groupName }),
      participants: participantDetails,
    };
  }

  async allChats(userId: string) {
    // Fetch chats involving the user
    const chats = await this.chatModel
      .find({ participants: userId, type: { $ne: 'broadcast' } }) // Exclude broadcast
      .select('_id groupName type participants');

    // Fetch broadcasts involving the user as sender
    const broadcasts = await this.chatModel
      .find({ senderId: userId, type: 'broadcast' })
      .select('_id broadCastName type participants');

    chats.push(...broadcasts);

    // Populate participant details for each chat
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        const participantDetails = await this.userModel
          .find({ _id: { $in: chat.participants } })
          .select('_id username');

        return {
          _id: chat._id,
          type: chat.type,
          ...(chat.type === 'group'
            ? { groupName: chat.groupName }
            : { broadCastName: chat.broadCastName }),
          participants: participantDetails,
        };
      }),
    );

    return populatedChats;
  }

  async createBroadCast({
    broadCastName,
    participants,
    userId,
  }: {
    broadCastName: string;
    participants: Types.ObjectId[];
    userId: Types.ObjectId;
  }) {
    const chat = await this.chatModel.create({
      broadCastName,
      participants,
      type: 'broadcast',
      senderId: userId,
    });

    // Fetch participant details
    const participantDetails = await this.userModel
      .find({ _id: { $in: participants } })
      .select('_id username');

    return {
      _id: chat._id,
      type: chat.type,
      broadCastName: chat.broadCastName,
      participants: participantDetails,
    };
  }
}
