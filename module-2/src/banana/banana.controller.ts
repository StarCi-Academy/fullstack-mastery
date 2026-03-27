import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { BananaService } from './banana.service';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Cat } from 'src/mongodb/schemas/cat.schema';

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

  @Post()
  createBanana(): Promise<void> {
    return this.bananaService.createBanana();
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