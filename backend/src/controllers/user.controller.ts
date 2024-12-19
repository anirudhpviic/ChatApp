import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { Request, Response } from 'express';
import { AuthUserDto } from 'src/dto/user/auth-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = body;

    const { user, accessToken, refreshToken } = await this.userService.signup(
      username,
      password,
    );

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   maxAge: 15 * 60 * 1000,
    // }); // 15 minutes
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // }); // 7 days

    return {
      message: 'User created successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  @Post('/login')
  async login(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = body;

    const { user, accessToken, refreshToken } = await this.userService.login(
      username,
      password,
    );

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   maxAge: 15 * 60 * 1000,
    // }); // 15 minutes
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // }); // 7 days

    return {
      message: 'User logged in successfully',
      user: { accessToken, refreshToken, ...user },
    };
  }

  // @Get('logout')
  // async logout(@Res({ passthrough: true }) res: Response) {
  //   res.clearCookie('accessToken');
  //   res.clearCookie('refreshToken');
  //   return { message: 'User logged out successfully' };
  // }

  // @Post('refresh-token')
  // async refreshToken(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const refreshToken: string = req.cookies['refreshToken'];
  //   console.log(req);

  //   if (!refreshToken) {
  //     throw new Error('No refresh token provided');
  //   }
  //   try {
  //     const { accessToken, newRefreshToken } =
  //       await this.userService.refresh(refreshToken);

  //     // res.cookie('accessToken', accessToken, {
  //     //   httpOnly: true,
  //     //   maxAge: 15 * 60 * 1000,
  //     // }); // 15 minutes
  //     // res.cookie('refreshToken', newRefreshToken, {
  //     //   httpOnly: true,
  //     //   maxAge: 7 * 24 * 60 * 60 * 1000,
  //     // }); // 7 days

  //     return {
  //       message: 'Token refreshed successfully',
  //       accessToken,
  //       newRefreshToken,
  //     };
  //   } catch (error) {}
  // }
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }
    try {
      const { accessToken, newRefreshToken } =
        await this.userService.refresh(refreshToken);

      // res.cookie('accessToken', accessToken, {
      //   httpOnly: true,
      //   maxAge: 15 * 60 * 1000,
      // }); // 15 minutes
      // res.cookie('refreshToken', newRefreshToken, {
      //   httpOnly: true,
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // }); // 7 days

      return {
        message: 'Token refreshed successfully',
        accessToken,
        newRefreshToken,
      };
    } catch (error) {}
  }
}
