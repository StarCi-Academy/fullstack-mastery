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
import { TypeOrmModule } from '@nestjs/typeorm';
import envConfig from './env/env.config';
import { UserEntity } from './mysql/schemas/user.entity';
import { AppleEntity } from './mysql/schemas/apple.entity';
import { BananaEntity } from './mysql/schemas/banana.entity';
import { OrderEntity } from './mysql/schemas/order.entity';
import { BuyModule } from './buy/buy.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from 'keyv-redis';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './mongodb/schemas/cat.schema';

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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envConfig().database.host,
      port: envConfig().database.port,
      username: envConfig().database.username,
      password: envConfig().database.password,
      database: envConfig().database.database,
      entities: [UserEntity, AppleEntity, BananaEntity, OrderEntity],
      synchronize: true,
      // typeorm cho phép ae mình cấu hình cache cho query của mình
      cache: {
        type: 'redis',
        options: {
          url: 'redis://localhost:6696',
        },
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27021'),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis('redis://localhost:6696'),
          ],
        };
      },
      isGlobal: true,
    }),
    // bổ sung cái này thì mới xài đống repository
    TypeOrmModule.forFeature([UserEntity, AppleEntity, BananaEntity, OrderEntity]),
    AppleModule,
    BananaModule,
    BuyModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MathService, RandomService],
})
export class AppModule {}
