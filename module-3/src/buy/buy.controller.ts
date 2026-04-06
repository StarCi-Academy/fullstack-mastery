import { Controller, Get, Post } from '@nestjs/common';
import { BuyService } from './buy.service';

@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @Post("user")
  createUser(): Promise<void> {
    return this.buyService.createUser();
  } 

  @Post("order")
  createOrder(): Promise<void> {
    return this.buyService.createOrder();
  }

  @Post()
  buy(): Promise<void> {
    return this.buyService.buy();
  }
}