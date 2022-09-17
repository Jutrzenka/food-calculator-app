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
import { RecipeService } from './recipe.service';
import { JwtUserGuard } from '../auth/authorization-token/guard/jwtUser.guard';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import { FindAllRecipeDto } from './dto/findAll-recipe.dto';
import { FindOneRecipeParam } from './dto/findOne-recipe.param';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Controller('/api/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtUserGuard)
  findAll(
    @UserObj() user: User,
    @Body() { limit, page }: FindAllRecipeDto,
  ): Promise<JsonCommunicationType> {
    return this.recipeService.findAll(user, limit, page);
  }

  @Put()
  @UseGuards(JwtUserGuard)
  create(@UserObj() user: User): Promise<JsonCommunicationType> {
    return this.recipeService.create(user);
  }

  @Get('/:idRecipe')
  @UseGuards(JwtUserGuard)
  findOne(
    @UserObj() user: User,
    @Param() { idRecipe }: FindOneRecipeParam,
  ): Promise<JsonCommunicationType> {
    return this.recipeService.findOne(user, idRecipe);
  }

  @Patch('/:idRecipe')
  @UseGuards(JwtUserGuard)
  update(
    @UserObj() user: User,
    @Param() { idRecipe }: FindOneRecipeParam,
    @Body() updateRecipe: UpdateRecipeDto,
  ): Promise<JsonCommunicationType> {
    return this.recipeService.update(user, idRecipe, updateRecipe);
  }

  @Delete('/:idRecipe')
  @UseGuards(JwtUserGuard)
  remove(
    @UserObj() user: User,
    @Param() { idRecipe }: FindOneRecipeParam,
  ): Promise<JsonCommunicationType> {
    return this.recipeService.remove(user, idRecipe);
  }
}
