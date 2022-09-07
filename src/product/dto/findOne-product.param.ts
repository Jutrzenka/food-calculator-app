import { IsString } from 'class-validator';

export class FindOneProductParam {
  @IsString()
  idProduct: string;
}
