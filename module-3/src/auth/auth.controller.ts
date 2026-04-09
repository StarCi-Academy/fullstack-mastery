import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import ms from 'ms';
import type { StringValue } from 'ms';
import envConfig from '../env/env.config';
import { AuthService } from './auth.service';
import { REFRESH_COOKIE_NAME, SIGN_IN_COOKIE_NAME } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import type { UserEntity } from '../mysql/schemas/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Cookie httpOnly: trình duyệt tự gửi kèm request (credentials: include) */
  private setRefreshCookie(res: Response, refreshToken: string) {
    const maxAge = ms(envConfig().jwt.refreshExpiresIn as StringValue);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: typeof maxAge === 'number' ? maxAge : undefined,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  private setSignInCookie(res: Response, refreshToken: string) {
    const maxAge = ms(envConfig().jwt.refreshExpiresIn as StringValue);
    res.cookie(SIGN_IN_COOKIE_NAME, refreshToken, {
      httpOnly: true, // http only - nghĩa là chỉ có server mới được truy cập vào cookie này
      // browser không thể đọc dc cookie này
      // hacker không thể lợi dụng lỗ hổng của browser để lấy cookie này
      // đảm bảo hơn cho việc security với refresh token
      secure: process.env.NODE_ENV === 'production',
      // bảo mật hơn so với việc trả refresh token ở body
      // code 1 trang web => call api này và cố gắng đọc cookie này
      sameSite: 'lax',
      path: '/',
      maxAge: typeof maxAge === 'number' ? maxAge : undefined,
    });
  }

  private clearSignInCookie(res: Response) {
    res.clearCookie(SIGN_IN_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _r, ...rest } = result;
    return rest;
  }

  /** Bước 1: redirect sang Google OAuth */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    /* Passport xử lý redirect */
  }

  /** Bước 2: Google redirect về — cấp JWT + cookie giống login */
  @Get('google/callback')
  // call get vào đây => thì nó sẽ kiểm tra uri nếu trên uri mà có
  // parasm => call từ bên ngoiaf => tự động redirect sang trang auth gg
  // auth gg sẽ call lại API của anh em để nó gửi mấy cái token xác thực
  // verify nó
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    
    const user = req.user as UserEntity;
    const result = await this.authService.loginWithOAuthUser(user);
    this.setRefreshCookie(res, result.refreshToken);
    this.setSignInCookie(res, result.refreshToken);
    const { refreshToken: _r, ...rest } = result;
    return rest;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _r, ...rest } = result;
    return rest;
  }

   // hàm này nó không trả về refresh token mà nó gắn refresh token vào cookie
  /** Đăng nhập và gắn refresh JWT vào cookie tên `signInCookie` (không đặt `refresh_token`) */
  @Post('sign-in-cookie')
  async signInCookie(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    // không trả refresh token ở body
    // gắn vào cookie
    this.setSignInCookie(res, result.refreshToken);
    const { refreshToken: _r, ...rest } = result;
    return rest;
  }

  /** Body `{ refreshToken }` hoặc cookie `refresh_token` (ưu tiên body nếu có) */
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      dto.refreshToken ??
      req.cookies?.[REFRESH_COOKIE_NAME] ??
      req.cookies?.[SIGN_IN_COOKIE_NAME] ??
      '';
    const result = await this.authService.refresh(token);
    this.setRefreshCookie(res, result.refreshToken);
    this.setSignInCookie(res, result.refreshToken);
    const { refreshToken: _r, ...rest } = result;
    return rest;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeRefresh(req.cookies?.[REFRESH_COOKIE_NAME]);
    await this.authService.revokeRefresh(req.cookies?.[SIGN_IN_COOKIE_NAME]);
    this.clearRefreshCookie(res);
    this.clearSignInCookie(res);
    return { ok: true };
  }
}
