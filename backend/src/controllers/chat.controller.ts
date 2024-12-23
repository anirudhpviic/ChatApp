import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';
import { Types } from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChat(
    @Body()
    body: {
      data: {
        groupName?: string;
        participants: Types.ObjectId[];
        type: 'one-to-one' | 'group';
      };
    },
  ) {
    try {
      const res = await this.chatService.createChat(body.data);

      return res;
    } catch (error) {
      console.error('Error creating chat:', error.message);
      throw error;
    }
  }

  @Get()
  async getAllChats(@Query('userId') userId: string) {
    try {
      return await this.chatService.allChats(userId);
    } catch (error) {
      console.error('Error fetching chats:', error.message);
      throw error;
    }
  }
}
