import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe extends Document {
  @Prop({ required: true, unique: true })
  idRecipe: string;
  @Prop({ required: true })
  idUser: string;
  @Prop({ required: true, maxlength: 256 })
  name: string;
  @Prop({
    required: true,
    default(): [] {
      return [];
    },
  })
  relations: Array<string>;
  @Prop()
  description: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
