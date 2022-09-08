import { IsNumber, Max } from 'class-validator';

export class FindAllRecipeDto {
  @IsNumber()
  @Max(50)
  limit: number;
  @IsNumber()
  page: number;
}
