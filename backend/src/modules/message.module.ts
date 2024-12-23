import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from 'src/controllers/message.controller';
import { MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from 'src/services/message.service';
import { SocketModule } from './socket.module';
import { ChatSchema } from 'src/schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    SocketModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
