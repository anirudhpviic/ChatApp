import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from 'src/controllers/chat.controller';
import { ChatSchema } from 'src/schemas/chat.schema';
import { ChatService } from 'src/services/chat.service';
import { UserSchema } from 'src/schemas/user.schema';
import { SocketModule } from './socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SocketModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
