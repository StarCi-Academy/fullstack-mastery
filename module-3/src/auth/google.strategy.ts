import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import envConfig from '../env/env.config';
import { AuthService } from './auth.service';
import { writeFileSync } from 'fs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const g = envConfig().google;
    super({
      clientID: g.clientId || 'missing-google-client-id',
      clientSecret: g.clientSecret || 'missing-google-client-secret',
      callbackURL: g.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  // nestjs nó tự verify cái thông tin trả về từ gg và nó chuyển snga
  // access token và refresh token của gg
  // trả 1 cái profile => tài khoản google của người dùng
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    console.log('profile', profile);
    console.log('accessToken', _accessToken);
    console.log('refreshToken', _refreshToken);
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    return this.authService.findOrCreateGoogleUser({
      googleId: profile.id,
      email,
      firstName: profile.name?.givenName ?? profile.displayName ?? 'User',
      lastName: profile.name?.familyName ?? '',
    });
  }
}
