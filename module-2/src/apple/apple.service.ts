import { Injectable } from '@nestjs/common';
import { BananaService } from '../banana/banana.service';
import { AppleDto } from './apple.dto';

@Injectable()
export class AppleService {
    constructor(
        // banana nó đang phụ thuộc vào apple
        private readonly bananaService: BananaService
    ) {}
  getApple(): string {
    return 'I have an apple ' + this.bananaService.getBanana();
  }

  createApple(apple: AppleDto): string {
    return 'Apple created: ' + apple.name + ' - ' + apple.price;
  }
}