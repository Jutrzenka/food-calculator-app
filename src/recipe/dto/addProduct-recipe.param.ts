import { IsString } from 'class-validator';

export class AddProductRecipeParam {
  @IsString()
  idRecipe: string;
  @IsString()
  idProduct: string;
}
