import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.ORIGIN || 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow cookies
  });

  app.use(cookieParser());

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // // TODO:testing
  // const jwtService = app.get(JwtService);
  // // Apply the AuthGuard globally
  // app.useGlobalGuards(new AuthGuard(jwtService));
  // // TODO: end

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  // Apply AuthGuard globally
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
