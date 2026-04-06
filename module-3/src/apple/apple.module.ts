import { Module } from '@nestjs/common';
import { AppleService } from './apple.service';
import { AppleController } from './apple.controller';
import { AppleGuard } from './apple.guard';

@Module({
  controllers: [AppleController],
  providers: [
    AppleService,
    AppleGuard,
  ],
})
export class AppleModule {}