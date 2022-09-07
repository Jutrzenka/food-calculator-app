import { IsNumber, Max } from 'class-validator';

export class FindAllProductDto {
  @IsNumber()
  @Max(50)
  limit: number;
  @IsNumber()
  page: number;
}
