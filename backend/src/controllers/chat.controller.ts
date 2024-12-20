import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-group')
  async createGroupChat(@Body() body) {
    // TODO: user creating user id not there add later
    // console.log(body)
    // console.log('kere');

    try {
      return await this.chatService.createGroupChat(body.data);
      // console.log(res);
      // return groupchat;
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getALlChats(@Query('userId') userId: string) {
    console.log('uer:', userId);
    const res = await this.chatService.allChats(userId);

    return res;
  }
}
