import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { AuthUserDto } from 'src/dto/user/auth-user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() body: AuthUserDto) {
    const { username, password } = body;

    try {
      const { user, accessToken, refreshToken } = await this.authService.signup(
        username,
        password,
      );
      return {
        message: 'User created successfully',
        user: { accessToken, refreshToken, ...user },
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Public()
  @Post('/login')
  async login(@Body() body: AuthUserDto) {
    const { username, password } = body;

    try {
      const { user, accessToken, refreshToken } = await this.authService.login(
        username,
        password,
      );

      return {
        message: 'User logged in successfully',
        user: { accessToken, refreshToken, ...user },
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }
    try {
      const { accessToken, newRefreshToken } =
        await this.authService.refresh(refreshToken);

      return {
        message: 'Token refreshed successfully',
        accessToken,
        newRefreshToken,
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Get()
  async getAllUsers() {
    try {
      const users = await this.authService.getAllUsers();
      console.log(users);
      return users;
    } catch (error) {}
  }
}
