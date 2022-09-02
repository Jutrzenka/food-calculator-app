import { IsString } from 'class-validator';

export class ConfirmUserParam {
  @IsString()
  login: string;
  @IsString()
  registerCode: string;
}
