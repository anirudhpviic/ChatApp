import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.cookies['accessToken'];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET, // Ensure you use the same secret for verification
      });

      req.user = decoded; // Attach decoded user info to request
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
