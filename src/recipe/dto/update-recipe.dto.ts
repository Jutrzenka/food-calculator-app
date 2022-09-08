import { IsString, MaxLength } from 'class-validator';

export class UpdateRecipeDto {
  @IsString()
  @MaxLength(256)
  name: string;
  @IsString()
  description: string;
}
