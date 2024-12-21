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
    private jwtService: JwtService,
  ) {}

  async signup(username: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ username, password: hashedPassword });

      const { accessToken, refreshToken } = this.generateTokens(user);
      user.refreshToken = refreshToken;
      await user.save();

      const safeUser = await this.userModel.aggregate([
        { $match: { username } },
        {
          $project: {
            // Exclude sensitive fields
            password: 0,
            refreshToken: 0,
          },
        },
      ]);

      return { user: safeUser[0], accessToken, refreshToken };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async login(username: string, password: string) {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);
      user.refreshToken = refreshToken;
      await user.save();

      const safeUser = await this.userModel.aggregate([
        { $match: { username } },
        {
          $project: {
            // Exclude sensitive fields
            password: 0,
            refreshToken: 0,
          },
        },
      ]);

      return { user: safeUser[0], accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      const user = await this.userModel.findOne({ refreshToken });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate a new access token
      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      // Update the user's refresh token in the database
      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken, newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  //   generate tokens
  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    // Payload for the tokens
    const payload = { username: user.username, _id: user._id };

    // Generate access token (valid for 15 minutes)
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET, // Use environment variables
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m', // Use default value if not set
    });

    // Generate refresh token (valid for 7 days)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET, // Use environment variables
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d', // Use default value if not set
    });
    return { accessToken, refreshToken };
  }
}
