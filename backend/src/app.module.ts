import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/mongodb.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { ChatModule } from './modules/chat.module';
import { SocketModule } from './modules/socket.module';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    ChatModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
