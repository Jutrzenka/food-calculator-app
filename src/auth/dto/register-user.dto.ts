import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
}
