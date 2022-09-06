import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  password: string;
}
