import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req) {
    try {
      return await this.userService.getAllUsers(req.user._id as Types.ObjectId);
    } catch (error) {
      throw error;
    }
  }
}
