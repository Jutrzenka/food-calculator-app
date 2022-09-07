import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtUserGuard } from '../auth/authorization-token/guard/jwtUser.guard';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import { FindAllProductDto } from './dto/findAll-product.dto';
import { FindOneProductParam } from './dto/findOne-product.param';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtUserGuard)
  findAll(@UserObj() user: User, @Body() { limit, page }: FindAllProductDto) {
    return this.productService.findAll(user, limit, page);
  }

  @Post()
  @UseGuards(JwtUserGuard)
  create(@UserObj() user: User) {
    return this.productService.create(user);
  }

  @Get('/:idProduct')
  @UseGuards(JwtUserGuard)
  findOne(@UserObj() user: User, @Param() { idProduct }: FindOneProductParam) {
    return this.productService.findOne(user, idProduct);
  }

  //@TODO Dodać Patch i Delete, a następnie limit produktów na jednego użytkownika. Potem przejść do receptur
  @Patch('/:idProduct')
  @UseGuards(JwtUserGuard)
  update(
    @UserObj() user: User,
    @Param() { idProduct }: FindOneProductParam,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(user, idProduct, updateProductDto);
  }

  @Delete('/:id')
  @UseGuards(JwtUserGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
