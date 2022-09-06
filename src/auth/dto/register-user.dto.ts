import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
}
