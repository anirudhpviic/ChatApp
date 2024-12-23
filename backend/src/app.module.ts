import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/mongodb.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { ChatModule } from './modules/chat.module';
import { SocketModule } from './modules/socket.module';
import { UserModule } from './modules/user.module';
import { MessageModule } from './modules/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ChatModule,
    SocketModule,
    UserModule,
    MessageModule,
  ],
})
export class AppModule {}
