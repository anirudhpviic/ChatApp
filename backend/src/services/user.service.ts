import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async getAllUsers(userId: Types.ObjectId) {
    try {
      const users = await this.userModel
        .find({ _id: { $ne: userId } }) // Exclude the user with the given userId
        .select('_id username'); // Include only _id and username

      console.log('all uses:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getAllConnectedUsers(userId: Types.ObjectId) {
    try {
      // Step 1: Find one-to-one chats involving the user
      const chats = await this.chatModel.find({
        type: 'one-to-one',
        participants: userId,
      });

      // Step 2: Extract the other user's IDs
      const otherUserIds = chats
        .map((chat) => chat.participants.find((id) => id !== userId)) // Find the other user in participants
        .filter((id) => id); // Filter out null values (in case of missing participants)

      if (otherUserIds.length === 0) {
        return []; // No connected users
      }

      // Step 3: Fetch usernames from the User model
      return await this.userModel
        .find({ _id: { $in: otherUserIds } })
        .select('_id username'); // Select only the _id and username fields
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
