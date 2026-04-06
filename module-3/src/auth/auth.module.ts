import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import envConfig from '../env/env.config';
import { UserEntity } from '../mysql/schemas/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: () => {
        const cfg = envConfig();
        return {
          secret: cfg.jwt.secret,
          signOptions: {
            expiresIn: cfg.jwt.accessExpiresIn as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RolesGuard],
  exports: [AuthService, JwtModule, PassportModule, RolesGuard],
})
export class AuthModule {}
