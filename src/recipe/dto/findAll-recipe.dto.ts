import { IsNumber, Max } from 'class-validator';

export class FindAllRecipeDto {
  @IsNumber()
  @Max(100)
  limit: number;
  @IsNumber()
  page: number;
}
