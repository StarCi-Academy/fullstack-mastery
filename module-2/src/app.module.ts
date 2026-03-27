import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathService } from './math.service';
import { RandomService } from './random.service';
import { AppleModule } from './apple';
import { BananaModule } from './banana';
import { EnvModule } from './env';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Module({
  imports: [
    // nếu module apple dính bug mà không fix kịp
    // xóa code đi
    // bỏ apple module ra khỏi import
    // thì project vẫn chạy dc, và bỏ qua apple
    // 1 bạn khác trong team chỉ cần fix apple module là xong.
    EnvModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        level: 'info',
        format: winston.format.json(),
        transports: [
          // dựa vào các transport để log lỗi vào file hoặc console
          // log vào console để debug, log vào file để lưu lại lỗi
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('MyApp', {
                colors: true,
                prettyPrint: true,
                processId: true,
                appName: true,
              }),
            ),
          }),
          // ghi vào file để lưu lại lỗi
          new winston.transports.File({ filename: 'error.log', level: 'info' }),
          // rất nhiều các log khác
          // winston là công cụ log tuyệt vời - nó cho phép các bỏ nhiều transport
          // rất NHIỀU transport khác nhau, Loki, Sentry, etc.
        ],
      }),
    }),
    AppleModule,
    BananaModule,
  ],
  controllers: [AppController],
  providers: [AppService, MathService, RandomService],
})
export class AppModule {}
