import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users.service';
import { UserRole } from 'src/users/entities/user.entity';
interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'default_secret',
      });
      //  We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      //TODO similar to auth middleware from express, get user info from database and attach to request
      //as of now we are just attaching the payload.

      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }
      // load full user from database and attach to request
      const user = await this.usersService.getUserById(payload.id);
      request['user'] = user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}