import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAllMessages(@Query('groupId') groupId: string, @Req() req) {
    return this.messageService.getAllMessages(groupId, req.user._id);
  }

  @Post('/broadcast')
  async createBroadcastMessage(
    @Body()
    body: {
      groupId: string;
      message: {
        type: string;
        content: string;
        format?: string;
      };
    },
    @Req() req,
  ) {
    return this.messageService.createBroadcastMessage({
      groupId: body.groupId,
      message: body.message,
      sender: req.user._id,
    });
  }
}
