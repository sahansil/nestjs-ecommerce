import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/users/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get required roles set on the route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }
    
    // 2. Get the request object and the user
    const { user } = context.switchToHttp().getRequest();

    // 3. Check if the user has at least one of the required roles
    return requiredRoles.some((role) => user.role?.includes(role));

    // NOTE: This assumes your user object (attached by your Auth guard/strategy)
    // has a property named 'role' that is a string (e.g., 'admin').
  }
}