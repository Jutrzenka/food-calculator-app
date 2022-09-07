import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import {
  generateArrayResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { User } from '../auth/schema/user.schema';
import { generateUUID } from '../Utils/function/generateUUID';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(user) {
    try {
      await this.productModel.create({
        idUser: user.idUser,
        idProduct: generateUUID(),
        name: 'Nowy produkt',
      });
      return generateSuccessResponse();
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(user: User, limit: number, page: number) {
    const countElements = await this.productModel
      .find({ idUser: user.idUser })
      .countDocuments()
      .exec();
    const elements = await this.productModel
      .find(
        { idUser: user.idUser },
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
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
