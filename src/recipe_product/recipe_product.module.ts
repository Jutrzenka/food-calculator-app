import { Module } from '@nestjs/common';
import { Recipe_productService } from './recipe_product.service';
import { Recipe_productController } from './recipe_product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { User, UserSchema } from '../auth/schema/user.schema';
import { Recipe, RecipeSchema } from '../recipe/schema/recipe.schema';
import {
  Recipe_Product,
  Recipe_ProductSchema,
} from './schema/recipe_Product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    MongooseModule.forFeature([
      { name: Recipe_Product.name, schema: Recipe_ProductSchema },
    ]),
  ],
  controllers: [Recipe_productController],
  providers: [Recipe_productService],
})
export class Recipe_productModule {}
