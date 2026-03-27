import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LeafGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // lấy request từ context
    const request = context.switchToHttp().getRequest();
    // lấy header từ request
    const header = request.headers['leaf'];
    // nếu header là leaf thì return true, nghĩa là vượt qua guard
    if (header === 'leaf') {
      return true;
    }
    return false;
  }
}