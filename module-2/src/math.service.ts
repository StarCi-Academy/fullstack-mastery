import { Injectable } from '@nestjs/common';

@Injectable()
export class MathService {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }
  
  divide(a: number, b: number): number {
    return a / b;
  }

  power(a: number, b: number): number {
    return Math.pow(a, b);
  }

  sqrt(a: number): number {
    return Math.sqrt(a);
  }
}