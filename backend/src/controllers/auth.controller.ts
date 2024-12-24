import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { AuthUserDto } from 'src/dto/user/auth-user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() body: AuthUserDto) {
    const { username, password, role } = body;
    const { user, accessToken, refreshToken } = await this.authService.signup(
      username,
      password,
      role,
    );

    return {
      message: 'User created successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  @Public()
  @Post('/login')
  async login(@Body() body: AuthUserDto) {
    const { username, password } = body;
    const { user, accessToken, refreshToken } = await this.authService.login(
      username,
      password,
    );

    return {
      message: 'User logged in successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const tokens = await this.authService.refresh(refreshToken);

    return {
      message: 'Token refreshed successfully',
      ...tokens,
    };
  }
}
