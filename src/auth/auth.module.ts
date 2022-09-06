import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { AuthController } from './auth.controller';
import { JwtUserStrategy } from './authorization-token/jwtUser.strategy';
import { UserTokenService } from './authorization-token/user-token.service';

@Module({
  imports: [
    //add schema for auth
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtUserStrategy, UserTokenService],
  exports: [JwtUserStrategy, AuthService, UserTokenService],
})
export class AuthModule {}
