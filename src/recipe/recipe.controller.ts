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
import { RecipeService } from './recipe.service';
import { JwtUserGuard } from '../auth/authorization-token/guard/jwtUser.guard';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import { FindAllRecipeDto } from './dto/findAll-recipe.dto';
import { FindOneRecipeParam } from './dto/findOne-recipe.param';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AddProductRecipeParam } from './dto/addProduct-recipe.param';
import { AmountProductRecipeDto } from './dto/amountProduct-recipe.dto';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @UseGuards(JwtUserGuard)
  findAll(@UserObj() user: User, @Body() { limit, page }: FindAllRecipeDto) {
    return this.recipeService.findAll(user, limit, page);
  }

  @Post()
  @UseGuards(JwtUserGuard)
  create(@UserObj() user: User) {
    return this.recipeService.create(user);
  }

  @Get('/:idRecipe')
  @UseGuards(JwtUserGuard)
  findOne(@UserObj() user: User, @Param() { idRecipe }: FindOneRecipeParam) {
    return this.recipeService.findOne(user, idRecipe);
  }

  @Patch('/:idRecipe')
  @UseGuards(JwtUserGuard)
  update(
    @UserObj() user: User,
    @Param() { idRecipe }: FindOneRecipeParam,
    @Body() updateRecipe: UpdateRecipeDto,
  ) {
    return this.recipeService.update(user, idRecipe, updateRecipe);
  }

  @Delete('/:idRecipe')
  @UseGuards(JwtUserGuard)
  remove(@UserObj() user: User, @Param() { idRecipe }: FindOneRecipeParam) {
    return this.recipeService.remove(user, idRecipe);
  }

  //Added and deleted product in recipe

  @Post('/:idRecipe/:idProduct')
  @UseGuards(JwtUserGuard)
  addProductToRecipe(
    @UserObj() user: User,
    @Param() { idRecipe, idProduct }: AddProductRecipeParam,
    @Body() { amount }: AmountProductRecipeDto,
  ) {
    return this.recipeService.addProductToRecipe(user, idRecipe, {
      idProduct,
      amount,
    });
  }
}
