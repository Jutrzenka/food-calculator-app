import { IsNumber, Min } from 'class-validator';

export class AmountProductRecipeDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
