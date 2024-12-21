import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async getAllUsers() {
    try {
      const safeUsers = await this.userModel.aggregate([
        {
          $project: {
            // Exclude sensitive fields
            // password: 0,
            _id: 1,
            username: 1,

            // refreshToken: 0,
          },
        },
      ]);
      return safeUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
