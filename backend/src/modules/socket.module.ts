import { Module } from '@nestjs/common';
import { SocketGateway } from '../gateways/socket.gateway';
import { SocketService } from 'src/services/socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from 'src/services/message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],

  providers: [SocketGateway, SocketService, MessageService],
})
export class SocketModule {}
