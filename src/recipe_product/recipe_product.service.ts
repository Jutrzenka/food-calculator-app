import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema';
import { Recipe, RecipeDocument } from '../recipe/schema/recipe.schema';
import {
  generateArrayResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { ProductType } from '../Utils/type/product.type';
import {
  Recipe_Product,
  Recipe_ProductDocument,
} from './schema/recipe_Product.schema';
import { generateUUID } from '../Utils/function/generateUUID';
import { RestStandardError } from '../Utils/class/RestStandardError';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Injectable()
export class Recipe_productService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Recipe.name)
    private recipeModel: Model<RecipeDocument>,
    @InjectModel(Recipe_Product.name)
    private relationModel: Model<Recipe_ProductDocument>,
  ) {}

  async getProductToRecipe(
    { idUser }: User,
    idRecipe: string,
  ): Promise<JsonCommunicationType> {
    const recipeIsExist = await this.recipeModel.exists({
      idUser,
      idRecipe,
    });
    if (recipeIsExist === null) {
      throw new RestStandardError(
        'This recipe is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const relations = await this.relationModel.find(
      {
        idUser,
        idRecipe,
      },
      {
        _id: 0,
        __v: 0,
      },
      { lean: true },
    );
    const el = [];
    for (const recursionRelation of relations) {
      el.push(recursionRelation.idRelation);
    }
    const elements = await this.productModel.find(
      {
        idUser,
        relations: { $in: el },
      },
      {
        _id: 0,
        __v: 0,
        relations: 0,
      },
      { lean: true },
    );
    const recursionElements = [];
    for (const value of elements) {
      for (const rel of relations) {
        if (value.idProduct === rel.idProduct) {
          recursionElements.push({ ...value, amount: rel.amount });
        }
      }
    }
    return generateArrayResponse(
      recursionElements.length,
      1,
      recursionElements,
    );
  }

  async addProductToRecipe(
    { idUser }: User,
    idRecipe: string,
    { idProduct, amount }: ProductType,
  ): Promise<JsonCommunicationType> {
    const recipeIsExist = await this.recipeModel.exists({
      idUser,
      idRecipe,
    });
    if (recipeIsExist === null) {
      throw new RestStandardError(
        'This recipe is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const productIsExist = await this.productModel.exists({
      idUser,
      idProduct,
    });
    if (productIsExist === null) {
      throw new RestStandardError(
        'This product is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const relationIsExist = await this.relationModel.exists({
      idUser,
      idRecipe,
      idProduct,
    });
    if (relationIsExist !== null) {
      throw new RestStandardError(
        'This relation is already exist',
        HttpStatus.CONFLICT,
      );
    }
    try {
      const id = generateUUID();
      await this.relationModel.create({
        idUser,
        idRelation: id,
        idProduct,
        idRecipe,
        amount,
      });
      await this.recipeModel.updateOne(
        { idUser, idRecipe },
        { $addToSet: { relations: id } },
      );
      await this.productModel.updateOne(
        {
          idUser,
          idProduct,
        },
        { $addToSet: { relations: id } },
      );
    } catch (err) {
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return generateSuccessResponse();
  }

  async removeProductToRecipe(
    { idUser }: User,
    idRecipe: string,
    idProduct: string,
  ): Promise<JsonCommunicationType> {
    const element = await this.relationModel.findOneAndRemove({
      idUser,
      idRecipe,
      idProduct,
    });
    if (element === null) {
      throw new RestStandardError(
        'This relation is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.recipeModel.updateOne(
      { idUser, idRecipe },
      { $pull: { relations: element.idRelation } },
    );
    await this.productModel.updateOne(
      {
        idUser,
        idProduct,
      },
      { $pull: { relations: element.idRelation } },
    );
    return generateSuccessResponse();
  }
}
