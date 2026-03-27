import { Global, Module } from '@nestjs/common';
import { BananaService } from './banana.service';
import { BananaController } from './banana.controller';

@Global()
@Module({
  imports: [],
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