import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  login: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
}
