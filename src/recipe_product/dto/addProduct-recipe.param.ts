import { IsString } from 'class-validator';

export class ProductInRecipeParam {
  @IsString()
  idRecipe: string;
  @IsString()
  idProduct: string;
}

export class RecipeInRelationParam {
  @IsString()
  idRecipe: string;
}
