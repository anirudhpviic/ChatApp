import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { AuthUserDto } from 'src/dto/user/auth-user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() body: AuthUserDto): Promise<{
    message: string;
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
      createdAt: Date;
    };
  }> {
    const { username, password } = body;

    const { user, accessToken, refreshToken } = await this.authService.signup(
      username,
      password,
    );

    return {
      message: 'User created successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  @Public()
  @Post('/login')
  async login(@Body() body: AuthUserDto): Promise<{
    message: string;
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
      createdAt: Date;
    };
  }> {
    const { username, password } = body;

    const { user, accessToken, refreshToken } = await this.authService.login(
      username,
      password,
    );

    console.log('login:', { accessToken, refreshToken, ...user });
    return {
      message: 'User logged in successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new Error('No refresh token provided');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(body.refreshToken);

    return {
      message: 'Token refreshed successfully',
      accessToken,
      newRefreshToken,
    };
  }
}
