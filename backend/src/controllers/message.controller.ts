import { Controller, Get, Query, Req } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAllMessages(@Query('groupId') groupId: string, @Req() req) {
    return this.messageService.getAllMessages(groupId, req.user._id);
  }
}
