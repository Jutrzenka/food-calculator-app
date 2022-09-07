import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  @Max(20000)
  @Min(0)
  calories: number;
  @IsNumber()
  @Max(100)
  @Min(0)
  fat: number;
  @IsNumber()
  @Max(100)
  @Min(0)
  carbohydrates: number;
  @IsNumber()
  @Max(100)
  @Min(0)
  protein: number;
}
