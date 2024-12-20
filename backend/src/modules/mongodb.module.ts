import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from '../services/mongodb.service';
import { UserModule } from './user.module';
import { ChatModule } from './chat.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: DatabaseService, // Custom config via DatabaseService
    }),
    UserModule,
    ChatModule,
  ],
  providers: [DatabaseService],
  exports: [MongooseModule], // Export to make it available for other modules
})
export class DatabaseModule {}
