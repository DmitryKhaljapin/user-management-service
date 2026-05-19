import { IsEmail, IsString } from 'class-validator';

export class LoginrUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
