import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      console.log(users);
      return users;
    } catch (error) {
      throw error;
    }
  }
}
