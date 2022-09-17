import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtUserGuard } from '../auth/authorization-token/guard/jwtUser.guard';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import { FindAllProductDto } from './dto/findAll-product.dto';
import { FindOneProductParam } from './dto/findOne-product.param';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Controller('/api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtUserGuard)
  findAll(
    @UserObj() user: User,
    @Body() { limit, page }: FindAllProductDto,
  ): Promise<JsonCommunicationType> {
    return this.productService.findAll(user, limit, page);
  }

  @Put()
  @UseGuards(JwtUserGuard)
  create(@UserObj() user: User) {
    return this.productService.create(user);
  }

  @Get('/:idProduct')
  @UseGuards(JwtUserGuard)
  findOne(
    @UserObj() user: User,
    @Param() { idProduct }: FindOneProductParam,
  ): Promise<JsonCommunicationType> {
    return this.productService.findOne(user, idProduct);
  }

  @Patch('/:idProduct')
  @UseGuards(JwtUserGuard)
  update(
    @UserObj() user: User,
    @Param() { idProduct }: FindOneProductParam,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<JsonCommunicationType> {
    return this.productService.update(user, idProduct, updateProductDto);
  }

  @Delete('/:idProduct')
  @UseGuards(JwtUserGuard)
  remove(
    @UserObj() user: User,
    @Param() { idProduct }: FindOneProductParam,
  ): Promise<JsonCommunicationType> {
    return this.productService.remove(user, idProduct);
  }
}
