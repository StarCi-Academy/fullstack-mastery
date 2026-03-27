import { Injectable } from '@nestjs/common';
import { MathService } from './math.service';
import { RandomService } from './random.service';

@Injectable()
export class AppService {
  constructor(
    // anh không hề khởi tạo object math service
    // mà anh pass object math service như là tham số trong constructor
    // gọi là DI - không cần dùng toán tử new để tạo object bussiness, mà
    // các em pass thẳng vào bên trong constructor
    // ƯU ĐIỂM - là nếu có quá nhiều dependencies, thì chúng ta không cần phải khởi tạo tất cả chúng trong class service
    private readonly mathService: MathService,
    private readonly randomService: RandomService
  ) {}
  getHello(): string {
    const randomNumber = this.randomService.getRandomNumber();
    return this.mathService.add(1, 2).toString() + ' ' + randomNumber.toString(); // return về 3
  }
}
