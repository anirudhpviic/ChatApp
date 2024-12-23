import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAllUsers(userId: Types.ObjectId) {
    try {
      const users = await this.userModel.aggregate([
        {
          $match: {
            _id: { $ne: new Types.ObjectId(userId) }, // Exclude the user with the given userId
          },
        },
        {
          $project: {
            _id: 1,
            username: 1, // Include only _id and username
          },
        },
      ]);
      console.log('userId', userId);
      console.log('users', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
