import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { ChatSchema } from 'src/schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
