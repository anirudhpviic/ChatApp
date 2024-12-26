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
      return await this.userModel.aggregate([
        {
          $match: {
            _id: { $ne: userId }, // Exclude the user with the given userId
          },
        },
        {
          $project: {
            _id: 1,
            username: 1, // Include only _id and username
          },
        },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getAllConnectedUsers(userId: Types.ObjectId) {
    try {
      console.log("here 1");
      
      // Step 1: Find one-to-one chats involving the user
      const chats = await this.chatModel.find({
        type: 'one-to-one',
        participants: userId,
      });

      console.log("here 2",chats);
      

      // Step 2: Extract the other user's IDs
      const otherUserIds = chats
        .map((chat) => chat.participants.find((id) => id !== userId)) // Find the other user in participants
        .filter((id) => id); // Filter out null values (in case of missing participants)


      console.log("here 3",otherUserIds);

      if (otherUserIds.length === 0) {
        return []; // No connected users
      }

      // Step 3: Fetch usernames from the User model
      const connectedUsers = await this.userModel
        .find({ _id: { $in: otherUserIds } })
        .select('_id username'); // Select only the _id and username fields

      // Step 4: Return the connected users
      return connectedUsers;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
