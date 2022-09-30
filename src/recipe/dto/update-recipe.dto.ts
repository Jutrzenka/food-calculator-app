import { IsString, MaxLength } from 'class-validator';

export class UpdateRecipeDto {
  @IsString()
  @MaxLength(10)
  name: string;
  @IsString()
  description: string;
}
