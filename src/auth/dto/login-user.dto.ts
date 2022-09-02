import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
