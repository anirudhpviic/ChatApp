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
      groupName?: string;
      participants: Types.ObjectId[];
      type: 'one-to-one' | 'group';
    },
    @Req() req,
  ) {
    const userId = req.user._id;
    const { groupName, participants, type } = body;
    return this.chatService.createChat({
      groupName,
      participants,
      type,
      userId,
    });
  }

  @Get()
  async getAllChats(@Query('userId') userId: string) {
    return this.chatService.allChats(userId);
  }
}
