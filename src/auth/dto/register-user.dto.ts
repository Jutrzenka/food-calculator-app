import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  login: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
}
