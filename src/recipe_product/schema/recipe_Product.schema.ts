import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Recipe_ProductDocument = Recipe_Product & Document;

@Schema()
export class Recipe_Product extends Document {
  @Prop({ required: true, unique: true })
  idRelation: string;
  @Prop({ required: true })
  idUser: string;
  @Prop({ required: true })
  idProduct: string;
  @Prop({ required: true })
  idRecipe: string;
  @Prop({ required: true })
  amount: string;
}

export const Recipe_ProductSchema =
  SchemaFactory.createForClass(Recipe_Product);
