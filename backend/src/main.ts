import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: process.env.ORIGIN || 'http://localhost:5173', // Set allowed origin
      methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed
      credentials: true, // Allow cookies
    });

    // Use Cookie Parser
    app.use(cookieParser());

    // Enable Global Validation Pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip non-whitelisted properties
        forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
        transform: true, // Automatically transform payloads to DTOs
      }),
    );

    // Enable WebSocket Adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    // Dependency Injection
    const reflector = app.get(Reflector);
    const jwtService = app.get(JwtService);

    // Apply Global AuthGuard
    app.useGlobalGuards(new AuthGuard(jwtService, reflector));

    // Start Server
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting application:', error.message);
    process.exit(1); // Exit with failure
  }
}

bootstrap();
