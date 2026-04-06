import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class RefreshDto {
  /** Body (mobile / Postman); để trống khi gửi kèm cookie httpOnly */
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MinLength(10)
  refreshToken?: string;
}
