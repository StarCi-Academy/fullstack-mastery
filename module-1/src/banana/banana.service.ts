import { Injectable } from '@nestjs/common';

@Injectable()
export class BananaService {
  getBanana(): string {
    return 'I have a banana';
  }
}