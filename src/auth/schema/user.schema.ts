import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  idUser: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({
    required: true,
    min: 0,
    max: 250,
    default(): number {
      return 0;
    },
  })
  productLimit: number;
  @Prop({
    required: true,
    min: 0,
    max: 100,
    default(): number {
      return 0;
    },
  })
  recipeLimit: number;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  surname: string;
  @Prop({ required: false, default: null })
  password: string | null;
  @Prop({ required: false, default: null })
  accessToken: string | null;
  @Prop({ required: false })
  registerCode: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
