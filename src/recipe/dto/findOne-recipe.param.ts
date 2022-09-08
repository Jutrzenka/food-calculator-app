import { IsString } from 'class-validator';

export class FindOneRecipeParam {
  @IsString()
  idRecipe: string;
}
