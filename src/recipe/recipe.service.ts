import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema';
import { Recipe, RecipeDocument } from './schema/recipe.schema';
import { generateUUID } from '../Utils/function/generateUUID';
import {
  generateArrayResponse,
  generateElementResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ProductType } from '../Utils/type/product.type';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Recipe.name)
    private recipeModel: Model<RecipeDocument>,
  ) {}
  async create({ idUser, recipeLimit }: User) {
    if (recipeLimit < 100) {
      try {
        await this.recipeModel.create({
          idUser,
          idRecipe: generateUUID(),
          name: 'Nowy przepis',
          description: 'Opis przepisu',
        });
        await this.userModel.findOneAndUpdate(
          {
            idUser,
          },
          { recipeLimit: recipeLimit + 1 },
        );
        return generateSuccessResponse();
      } catch (err) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException('Too many recipe', HttpStatus.CONFLICT);
    }
  }

  async findAll({ idUser }: User, limit: number, page: number) {
    try {
      const countElements = await this.recipeModel
        .find({ idUser })
        .countDocuments()
        .exec();
      const elements = await this.recipeModel
        .find(
          { idUser },
          { __v: 0, _id: 0 },
          {
            limit,
            skip: limit * (page - 1),
          },
        )
        .exec();
      return generateArrayResponse(
        countElements,
        Math.ceil(countElements / limit),
        elements,
      );
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne({ idUser }: User, idRecipe: string) {
    try {
      const elements = await this.recipeModel
        .findOne(
          {
            idUser,
            idRecipe,
          },
          { __v: 0, _id: 0 },
        )
        .exec();
      return generateElementResponse('object', elements);
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    { idUser }: User,
    idRecipe: string,
    { name, description }: UpdateRecipeDto,
  ) {
    try {
      const element = await this.recipeModel.findOneAndUpdate(
        {
          idUser,
          idRecipe,
        },
        { name, description },
      );
      if (element === null) throw new Error('NOT FOUND RECIPE');
      return generateSuccessResponse();
    } catch (err) {
      if (err.message === 'NOT FOUND RECIPE') {
        throw new HttpException(
          'This recipe is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove({ idUser, recipeLimit }: User, idRecipe: string) {
    try {
      const element = await this.recipeModel.findOneAndRemove({
        idUser,
        idRecipe,
        products: [],
      });
      if (element === null) throw new Error('NOT FOUND RECIPE');
      await this.userModel.findOneAndUpdate(
        {
          idUser,
        },
        { recipeLimit: recipeLimit - 1 },
      );
      return generateSuccessResponse();
    } catch (err) {
      if (err.message === 'NOT FOUND RECIPE') {
        throw new HttpException(
          'This recipe is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addProductToRecipe(
    { idUser }: User,
    idRecipe: string,
    product: ProductType,
  ) {
    const value = await this.productModel.exists({
      idUser,
      idProduct: product.idProduct,
    });
    if (value === null) {
      throw new HttpException(
        'This product is not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      const recipe = await this.recipeModel.findOneAndUpdate(
        {
          idUser,
          idRecipe,
        },
        {
          $addToSet: { products: product },
        },
      );
      if (recipe === null) throw new Error('NOT FOUND RECIPE');
      const element = await this.productModel.findOneAndUpdate(
        {
          idUser,
          idProduct: product.idProduct,
        },
        {
          $addToSet: { relations: idRecipe },
        },
      );
      if (element === null) throw new Error('NOT FOUND PRODUCT');
      return generateSuccessResponse();
    } catch (err) {
      if (err.message === 'NOT FOUND PRODUCT') {
        throw new HttpException(
          'This product is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      if (err.message === 'NOT FOUND RECIPE') {
        throw new HttpException(
          'This recipe is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
