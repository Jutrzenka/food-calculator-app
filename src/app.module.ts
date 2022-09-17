import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { RecipeModule } from './recipe/recipe.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './Utils/config/configuration';
import { Recipe_productModule } from './recipe_product/recipe_product.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().databaseMongo.host),
    ProductModule,
    RecipeModule,
    Recipe_productModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public/build'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
