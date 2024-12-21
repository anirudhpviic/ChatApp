// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req = context.switchToHttp().getRequest();

//     // Access the access token from the body
//     const { accessToken } = req.body;

//     console.log('accessToken', accessToken);

//     if (!accessToken) {
//       throw new UnauthorizedException('Access token is missing');
//     }

//     try {
//       // Verify the token
//       const decoded = await this.jwtService.verifyAsync(accessToken, {
//         secret: process.env.JWT_ACCESS_SECRET, // Ensure your secret matches the one used for signing
//       });

//       // Attach decoded user info to the request for downstream usage
//       req.user = decoded;

//       return true; // Grant access
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         throw new UnauthorizedException('Access token has expired');
//       }

//       throw new UnauthorizedException('Invalid access token');
//     }
//   }
// }

// src/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    // Skip guard for public routes
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      req.user = decoded;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
