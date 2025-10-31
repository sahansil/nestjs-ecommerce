import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}

export const LoggedInUser = createParamDecorator(
  (data: keyof RequestWithUser['user'], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request['user'];
    return data ? user?.[data] : user;
  },
);