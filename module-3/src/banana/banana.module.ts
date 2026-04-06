import { Global, Module } from '@nestjs/common';
import { BananaService } from './banana.service';
import { BananaController } from './banana.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/mongodb/schemas/cat.schema';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BananaEntity]),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [BananaController],
  providers: [
    BananaService,
  ],
  // xuất khẩu thằng BananaService ra ngoài, cho những thằng khác xài
  // nếu 1 service của module này muốn dc thằng khác xài, bỏ vào exports và thằng
  // khác phải import BananaModule
  exports: [BananaService],
})
export class BananaModule {}