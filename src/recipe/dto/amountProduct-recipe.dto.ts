import { IsNumber } from 'class-validator';

export class AmountProductRecipeDto {
  @IsNumber()
  amount: number;
}
