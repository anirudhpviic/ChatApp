import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAllMessages(@Query('groupId') groupId: string) {
    console.log('getAllMessages', groupId);
    return await this.messageService.getAllMessages(groupId);
  }
}
