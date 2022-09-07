import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmUserParam {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  registerCode: string;
}
