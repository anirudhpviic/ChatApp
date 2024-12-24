import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';
import { Types } from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChat(
    @Body()
    body: {
      groupName?: string;
      participants: Types.ObjectId[];
      type: 'one-to-one' | 'group';
    },
  ) {
    const { groupName, participants, type } = body;
    return this.chatService.createChat({ groupName, participants, type });
  }

  @Get()
  async getAllChats(@Query('userId') userId: string) {
    return this.chatService.allChats(userId);
  }
}
