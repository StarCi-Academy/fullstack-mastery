import { Global, Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { UserEntity } from 'src/mysql/schemas/user.entity';
import { OrderEntity } from 'src/mysql/schemas/order.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OrderEntity])],
  controllers: [BuyController],
  providers: [
    BuyService,
  ],
  // xuất khẩu thằng BananaService ra ngoài, cho những thằng khác xài
  // nếu 1 service của module này muốn dc thằng khác xài, bỏ vào exports và thằng
  // khác phải import BananaModule
  exports: [BuyService],
})
export class BuyModule {}