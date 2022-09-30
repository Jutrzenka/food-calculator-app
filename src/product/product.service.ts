import { HttpStatus, Injectable } from '@nestjs/common';
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
import { RestStandardError } from '../Utils/class/RestStandardError';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create({ idUser, productLimit }: User): Promise<JsonCommunicationType> {
    if (productLimit < 250) {
      try {
        const { idProduct, name } = await this.productModel.create({
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
        return generateElementResponse('object', {
          idProduct,
          idUser,
          name,
        });
      } catch (err) {
        throw new RestStandardError(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new RestStandardError('Too many product', HttpStatus.CONFLICT);
    }
  }

  async findAll(
    { idUser }: User,
    limit: number,
    page: number,
  ): Promise<JsonCommunicationType> {
    try {
      const countElements = await this.productModel
        .find({ idUser })
        .countDocuments()
        .exec();
      const elements = await this.productModel
        .find(
          { idUser },
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
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    { idUser }: User,
    idProduct: string,
  ): Promise<JsonCommunicationType> {
    try {
      const elements = await this.productModel
        .findOne(
          {
            idUser,
            idProduct,
          },
          { __v: 0, _id: 0, relations: 0 },
        )
        .exec();
      return generateElementResponse('object', elements);
    } catch (err) {
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    { idUser }: User,
    idProduct: string,
    { name, calories, fat, carbohydrates, protein }: UpdateProductDto,
  ): Promise<JsonCommunicationType> {
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
        throw new RestStandardError(
          'This product is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(
    { idUser, productLimit }: User,
    idProduct: string,
  ): Promise<JsonCommunicationType> {
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
        throw new RestStandardError(
          'This product is not found, or product is in the relation',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
