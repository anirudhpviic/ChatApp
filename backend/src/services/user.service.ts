import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
