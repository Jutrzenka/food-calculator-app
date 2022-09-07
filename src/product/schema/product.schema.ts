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
    required: true,
    default(): [] {
      return [];
    },
  })
  relations: Array<string>;
  @Prop({
    default(): null {
      return null;
    },
  })
  calories: number | null;
  @Prop({
    default(): null {
      return null;
    },
  })
  fat: number | null;
  @Prop({
    default(): null {
      return null;
    },
  })
  carbohydrates: number | null;
  @Prop({
    default(): null {
      return null;
    },
  })
  protein: number | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
