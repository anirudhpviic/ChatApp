import { Module } from '@nestjs/common';
import { SocketGateway } from '../gateways/socket.gateway';
import { SocketService } from 'src/services/socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from 'src/schemas/chat.schema';
import { MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from 'src/services/message.service';
import { CloudinaryModule } from './cloudinary.module';
import { UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    CloudinaryModule,
  ],

  providers: [SocketGateway, SocketService, MessageService],
  exports: [SocketService],
})
export class SocketModule {}
