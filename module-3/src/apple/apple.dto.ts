import { IsArray, IsNumber, IsString, Max, Min } from "class-validator";

export class AppleDto {
    // validate dữ liệu bằng annotation của class-validator - pipe nestjs
    @IsString()
    name: string;
    // validate giá trị của price
    @IsNumber()
    @Min(10)
    @Max(100)
    price: number;

    @IsArray()
    // validate mảng của tags
    @IsString({ each: true })
    tags: string[];
  }