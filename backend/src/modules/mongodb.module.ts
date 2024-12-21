import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from '../services/mongodb.service';
import { AuthModule } from './auth.module';
import { ChatModule } from './chat.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: DatabaseService, // Custom config via DatabaseService
    }),
    AuthModule,
    ChatModule,
  ],
  providers: [DatabaseService],
  exports: [MongooseModule], // Export to make it available for other modules
})
export class DatabaseModule {}
