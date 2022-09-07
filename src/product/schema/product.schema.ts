import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  idProduct: string;
  @Prop({ required: true })
  idUser: string;
  @Prop({ required: true })
  name: string;
  @Prop({
    default(): null {
      return null;
    },
  })
  calories: number;
  @Prop({
    default(): null {
      return null;
    },
  })
  fat: number;
  @Prop({
    default(): null {
      return null;
    },
  })
  carbohydrates: number;
  @Prop({
    default(): null {
      return null;
    },
  })
  protein: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
