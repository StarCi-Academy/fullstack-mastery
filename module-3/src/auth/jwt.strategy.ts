import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../mysql/schemas/user-role.enum';
import envConfig from '../env/env.config';

export type JwtPayload = {
  sub: number;
  email: string;
  typ?: 'access' | 'refresh';
  role?: UserRole;
};

// strategy là chiến lược để ae mình xài cho thằng auth guard
// share 1 bài về nó sau ở website cần thì tìm hiểu những config phức tạp hơn
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // lấy jwt từ header của request, nó xác thực xem token có hợp lệ không
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secret key để xác thực token
      // chính là secret key mà ae mình đã định nghĩa trong env.config.ts
      // đây là key tạo token cũng là key để xác thực token
      secretOrKey: envConfig().jwt.secret,
    });
  }

  // Chỉ chấp nhận access token (không dùng refresh token làm Bearer)
  validate(payload: JwtPayload) {
    if (payload.typ === 'refresh') {
      return false;
    }
    if (payload.typ !== undefined && payload.typ !== 'access') {
      return false;
    }
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role ?? UserRole.USER,
    };
  }
}
