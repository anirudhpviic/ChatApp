import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from 'src/controllers/admin.controller';
import { ChatSchema } from 'src/schemas/chat.schema';
import { AdminService } from 'src/services/admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
