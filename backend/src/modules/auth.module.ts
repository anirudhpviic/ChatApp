import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/controllers/auth.controller';
import { UserSchema } from 'src/schemas/user.schema';
import { AuthService } from 'src/services/auth.service';
import { UserModule } from './user.module';
import { MessageModule } from './message.module';
import { CloudinaryModule } from './cloudinary.module';
import { AdminModule } from './admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
    MessageModule,
    CloudinaryModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
