import { Body, Controller, Get, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppleGuard } from './apple.guard';
import { AppleService } from './apple.service';
import { LeafGuard } from './leaf.guard';
import { LoggingInterceptor } from './logging.interceptor';
import { TransformInterceptor } from './transform.interceptor';
import { AppleDto } from './apple.dto';
import { AppleFilters } from './apple.filters';

@Controller('apple')
export class AppleController {
  constructor(private readonly appleService: AppleService) {}

  @UseGuards(AppleGuard, LeafGuard)
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Get()
  getApple(): string {
    console.log("Controller is called");
    return this.appleService.getApple();
  }

  // viết API cực kì dễ viết nestjs annotation
  // @Post, @Body,.... rất nhiều annotation khác mình có thể tìm hiểu
  // Viết tài liệu nâng cao cho mà đọc
  @UsePipes(ValidationPipe)
  @Post('create')
  @UseFilters(AppleFilters)
  createApple(@Body() apple: AppleDto): string {
    console.log(apple);
    throw new Error('Thả lỗi nè')
    return this.appleService.createApple(apple);
  }
}

