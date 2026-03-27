import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  getRandomNumber(): number {
    return Math.random();
  }
}