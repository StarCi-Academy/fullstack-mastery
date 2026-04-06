
import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import envConfig from './env/env.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    this.logger.error('getHello is called');
    return envConfig()
  }

  @Get('test')
  getTest(): string {
    return 'Test';
  }
}
