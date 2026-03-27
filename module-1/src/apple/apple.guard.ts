import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AppleGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    // lấy request từ context
    const request = context.switchToHttp().getRequest();
    // lấy header từ request
    const header = request.headers['apple'];
    // nếu header là apple thì return true, nghĩa là vượt qua guard
    if (header === 'apple') {
      return true;
    }
    return false;
  }
}