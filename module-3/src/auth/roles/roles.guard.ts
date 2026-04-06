import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../mysql/schemas/user-role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // reflector nó sẽ lấy toàn bộ roles từ metadata của controllers
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) {
      return true;
    }
    // lấy user từ request
    const req = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    // lấy role từ user
    const role = req.user?.role ?? UserRole.USER;
    // nếu role không phải là admin thì throw error
    if (!required.includes(role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
