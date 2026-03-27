import { Controller, Get } from '@nestjs/common';
import { BananaService } from './banana.service';

@Controller('banana')
export class BananaController {
  constructor(private readonly bananaService: BananaService) {}

  @Get()
  getBanana(): string {
    return this.bananaService.getBanana();
  }
}