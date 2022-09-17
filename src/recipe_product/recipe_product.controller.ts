import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Recipe_productService } from './recipe_product.service';
import { JwtUserGuard } from '../auth/authorization-token/guard/jwtUser.guard';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import {
  ProductInRecipeParam,
  RecipeInRelationParam,
} from './dto/addProduct-recipe.param';
import { AmountProductRecipeDto } from './dto/amountProduct-recipe.dto';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Controller('/api/relation')
export class Recipe_productController {
  constructor(private readonly relationService: Recipe_productService) {}

  @Get('/:idRecipe')
  @UseGuards(JwtUserGuard)
  getProductFromRecipe(
    @UserObj() user: User,
    @Param() { idRecipe }: RecipeInRelationParam,
  ): Promise<JsonCommunicationType> {
    return this.relationService.getProductToRecipe(user, idRecipe);
  }

  @Post('/:idRecipe/:idProduct')
  @UseGuards(JwtUserGuard)
  addProductToRecipe(
    @UserObj() user: User,
    @Param() { idRecipe, idProduct }: ProductInRecipeParam,
    @Body() { amount }: AmountProductRecipeDto,
  ): Promise<JsonCommunicationType> {
    return this.relationService.addProductToRecipe(user, idRecipe, {
      idProduct,
      amount,
    });
  }

  @Delete('/:idRecipe/:idProduct')
  @UseGuards(JwtUserGuard)
  removeProductFromRecipe(
    @UserObj() user: User,
    @Param() { idRecipe, idProduct }: ProductInRecipeParam,
  ): Promise<JsonCommunicationType> {
    return this.relationService.removeProductToRecipe(
      user,
      idRecipe,
      idProduct,
    );
  }
}
