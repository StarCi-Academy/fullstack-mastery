import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // AI bảo mình cần email và password để login
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1, { message: 'password must not be empty' })
  password: string;
}
