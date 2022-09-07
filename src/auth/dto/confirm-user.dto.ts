import { IsString, MinLength } from 'class-validator';

export class ConfirmUserDto {
  @IsString()
  @MinLength(12)
  password: string;
}
