import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(username: string, password: string, role: string) {
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) throw new UnauthorizedException('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      role,
    });

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    const user = await this.userModel.findOne({ refreshToken }).exec();
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { username: user.username, _id: user._id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    };
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...rest } = user.toObject();
    return rest;
  }
}
