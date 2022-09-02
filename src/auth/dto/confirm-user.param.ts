import { IsString, MinLength } from 'class-validator';

export class ConfirmUserParam {
  @IsString()
  @MinLength(8)
  login: string;
  @IsString()
  registerCode: string;
}
