import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import {
  generateArrayResponse,
  generateElementResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { User, UserDocument } from '../auth/schema/user.schema';
import { generateUUID } from '../Utils/function/generateUUID';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create({ idUser, productLimit }: User) {
    if (productLimit < 250) {
      try {
        await this.productModel.create({
          idUser,
          idProduct: generateUUID(),
          name: 'Nowy produkt',
        });
        await this.userModel.findOneAndUpdate(
          {
            idUser,
          },
          { productLimit: productLimit + 1 },
        );
        return generateSuccessResponse();
      } catch (err) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException('Too many product', HttpStatus.CONFLICT);
    }
  }

  async findAll(user: User, limit: number, page: number) {
    try {
      const countElements = await this.productModel
        .find({ idUser: user.idUser })
        .countDocuments()
        .exec();
      const elements = await this.productModel
        .find(
          { idUser: user.idUser },
          { __v: 0, _id: 0, relations: 0 },
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

  async findOne(user: User, idProduct: string) {
    try {
      const elements = await this.productModel
        .findOne(
          {
            idUser: user.idUser,
            idProduct,
          },
          { __v: 0, _id: 0, relations: 0 },
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
    idProduct: string,
    { name, calories, fat, carbohydrates, protein }: UpdateProductDto,
  ) {
    try {
      const element = await this.productModel.findOneAndUpdate(
        {
          idUser,
          idProduct,
        },
        { name, calories, fat, carbohydrates, protein },
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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove({ idUser, productLimit }: User, idProduct: string) {
    try {
      const element = await this.productModel.findOneAndRemove({
        idUser,
        idProduct,
        relations: [],
      });
      if (element === null) throw new Error('NOT FOUND PRODUCT');
      await this.userModel.findOneAndUpdate(
        {
          idUser,
        },
        { productLimit: productLimit - 1 },
      );
      return generateSuccessResponse();
    } catch (err) {
      if (err.message === 'NOT FOUND PRODUCT') {
        throw new HttpException(
          'This product is not found',
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
