import { Injectable, BadRequestException } from '@nestjs/common';
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
  }: {
    groupName?: string;
    participants: Types.ObjectId[];
    type: 'one-to-one' | 'group';
  }) {
    if (!participants || participants.length < 1) {
      throw new BadRequestException('Participants array must not be empty');
    }

    // Validate inputs
    if (type === 'group' && !groupName) {
      throw new BadRequestException('Group name is required for group chats');
    }
    if (type === 'one-to-one' && participants.length !== 2) {
      throw new BadRequestException(
        'One-to-one chats must have exactly 2 participants',
      );
    }

    // TODO: stopped
    const chatData: Partial<Chat> = { type, participants };
    if (type === 'group') chatData.groupName = groupName;

    const chat = await this.chatModel.create(chatData);

    // Populate participant details
    const participantDetails = await this.userModel
      .find({ _id: { $in: participants } })
      .select('_id username');

    return {
      _id: chat._id,
      type: chat.type,
      ...(chat.type === 'group' && { groupName: chat.groupName }),
      participants: participantDetails,
    };
  }

  async allChats(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const chats = await this.chatModel
      .find({ participants: userId })
      .select('_id groupName type participants');

    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        const participantDetails = await this.userModel
          .find({ _id: { $in: chat.participants } })
          .select('_id username');

        return {
          _id: chat._id,
          type: chat.type,
          ...(chat.type === 'group' && { groupName: chat.groupName }),
          participants: participantDetails,
        };
      }),
    );

    return populatedChats;
  }
}
