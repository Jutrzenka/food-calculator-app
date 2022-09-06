import { IsString, MinLength } from 'class-validator';

export class ConfirmUserDto {
  @IsString()
  @MinLength(8)
  newLogin: string;
  @IsString()
  @MinLength(12)
  password: string;
}
