import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [ProductModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
