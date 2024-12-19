import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

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

  // TODO:testing
  // const jwtService = app.get(JwtService);
  // Apply the AuthGuard globally
  // app.useGlobalGuards(new AuthGuard(jwtService));
  // TODO: end

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
