import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Cache } from 'cache-manager';
import ms from 'ms';
import type { StringValue } from 'ms';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import envConfig from '../env/env.config';
import { UserEntity } from '../mysql/schemas/user.entity';
import { UserRole } from '../mysql/schemas/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;

const REFRESH_KEY = (jti: string) => `refresh:${jti}`;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private refreshTtlMs(): number {
    const n = ms(envConfig().jwt.refreshExpiresIn as StringValue);
    if (typeof n !== 'number') {
      throw new Error('Invalid jwt.refreshExpiresIn');
    }
    return n;
  }

  private async issueTokens(user: UserEntity) {
    const cfg = envConfig();
    const jti = randomUUID();
    await this.cacheManager.set(
      REFRESH_KEY(jti),
      String(user.id),
      this.refreshTtlMs(),
    );

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      typ: 'access',
      role: user.role,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        jti,
        typ: 'refresh',
        role: user.role,
      },
      {
        secret: cfg.jwt.refreshSecret,
        expiresIn: cfg.jwt.refreshExpiresIn as StringValue,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: passwordHash,
      money: '0',
      isActive: true,
      role: UserRole.USER,
    });
    await this.userRepository.save(user);
    return this.issueTokens(user);
  }

  /** Tìm / tạo user theo Google profile, gắn `googleId` nếu email đã tồn tại */
  async findOrCreateGoogleUser(params: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    let user = await this.userRepository.findOne({
      where: { googleId: params.googleId },
    });
    if (user) {
      return user;
    }
    user = await this.userRepository.findOne({
      where: { email: params.email },
    });
    if (user) {
      if (!user.googleId) {
        user.googleId = params.googleId;
        await this.userRepository.save(user);
      }
      return user;
    }
    const passwordHash = await bcrypt.hash(randomUUID(), BCRYPT_ROUNDS);
    const created = this.userRepository.create({
      googleId: params.googleId,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: passwordHash,
      money: '0',
      isActive: true,
      role: UserRole.USER,
    });
    await this.userRepository.save(created);
    return created;
  }

  async loginWithOAuthUser(user: UserEntity) {
    if (!user.isActive) {
      throw new UnauthorizedException('Account disabled');
    }
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken?.trim()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const cfg = envConfig();
    type RefreshPayload = {
      sub: number;
      email: string;
      jti: string;
      typ: string;
    };
    let payload: RefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshPayload>(
        refreshToken.trim(),
        { secret: cfg.jwt.refreshSecret },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.typ !== 'refresh' || !payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const stored = await this.cacheManager.get<string>(REFRESH_KEY(payload.jti));
    if (!stored || stored !== String(payload.sub)) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }
    await this.cacheManager.del(REFRESH_KEY(payload.jti));
    return this.issueTokens(user);
  }

  /** Thu hồi refresh trong Redis (logout có cookie / body) */
  async revokeRefresh(refreshToken: string | undefined) {
    if (!refreshToken?.trim()) {
      return;
    }
    const cfg = envConfig();
    try {
      const payload = await this.jwtService.verifyAsync<{ jti?: string }>(
        refreshToken.trim(),
        { secret: cfg.jwt.refreshSecret },
      );
      if (payload.jti) {
        await this.cacheManager.del(REFRESH_KEY(payload.jti));
      }
    } catch {
      // token hết hạn / sai — vẫn xóa cookie phía client
    }
  }
}
