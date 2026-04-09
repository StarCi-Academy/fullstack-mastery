import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// extedns và xúc thôi
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
