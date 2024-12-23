import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAllMessages(@Query('groupId') groupId: string, @Req() req) {
    console.log('getAllMessages', groupId);
    const res = await this.messageService.getAllMessages(groupId, req.user._id);
    console.log('getAllMessages res', res);
    return res;
  }
}
