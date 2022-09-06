import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { RecipeModule } from './recipe/recipe.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './Utils/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().databaseMongo.host),
    ProductModule,
    RecipeModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
