import { IsString } from 'class-validator';

export class ConfirmUserDto {
  @IsString()
  newLogin: string;
  @IsString()
  password: string;
}
