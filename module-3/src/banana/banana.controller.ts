import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BananaService } from './banana.service';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Cat } from 'src/mongodb/schemas/cat.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserRole } from '../mysql/schemas/user-role.enum';

@Controller('banana')
export class BananaController {
  constructor(private readonly bananaService: BananaService) {}

  // nestjs cung cấp công cụ native đẻ ae cache lại cái response của API 
  // luôn để
  //@UseInterceptors(CacheInterceptor)
  @Get()
  async getBanana(): Promise<BananaEntity[]> {
    return await this.bananaService.getBanana();
  }

  /** JWT + metadata role (chỉ admin) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async createBanana(): Promise<string> {
    return await this.bananaService.createBanana();
  }

  @Post('cat')
  createCat(): Promise<Cat> {
    return this.bananaService.createCat();
  }

  @Get('cat')
  getCat(): Promise<Cat[]> {
    return this.bananaService.getCat();
  } 
}