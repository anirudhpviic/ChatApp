import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req) {
    const userId = req.user._id as Types.ObjectId;
    return this.userService.getAllUsers(userId);
  }
}
