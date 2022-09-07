import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { generateArrayResponse } from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { User } from '../auth/schema/user.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(user: User, limit: number, page: number) {
    const countElements = await this.productModel
      .find({ idUser: user.idUser })
      .countDocuments()
      .exec();
    const elements = await this.productModel
      .find(
        { idUser: user.idUser },
        {},
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
