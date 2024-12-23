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
    // Check if username already exists
    try {
      const existingUser = await this.userModel.findOne({ username }).exec();
      if (existingUser) {
        throw new UnauthorizedException('Username already taken');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const user = await this.userModel.create({
        username,
        password: hashedPassword,
        role,
      });

      const tokens = this.generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      // Transform the user object to remove metadata
      const safeUser = user.toObject(); // Converts to plain JS object
      delete safeUser.password; // Ensure sensitive fields are excluded
      delete safeUser.refreshToken;

      return { user: safeUser, ...tokens };
    } catch (error) {
      throw error;
    }
  }

  async login(username: string, password: string) {
    // Find the user
    // const user = await this.userModel.findOne({ username }).exec();
    const user = await this.userModel
      .findOne({ username })
      .select('-refreshToken') // Explicitly include password for comparison
      .exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Transform the user object to remove metadata
    const safeUser = user.toObject(); // Converts to plain JS object
    delete safeUser.password; // Ensure sensitive fields are excluded

    // Return user data without sensitive fields
    // const safeUser = await this.userModel
    //   .findById(user._id)
    //   .select('-password -refreshToken')
    //   .exec();

    return { user: safeUser, ...tokens };
  }

  async refresh(refreshToken: string) {
    // Validate the refresh token
    const user = await this.userModel.findOne({ refreshToken }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
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

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return { accessToken, refreshToken };
  }
}
