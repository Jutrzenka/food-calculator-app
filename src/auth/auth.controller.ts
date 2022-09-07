import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { AuthService } from './auth.service';
import { User } from './schema/user.schema';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { ConfirmUserParam } from './dto/confirm-user.param';
import { JwtUserGuard } from './authorization-token/guard/jwtUser.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() { email, password }: LoginUserDto, @Res() res: Response) {
    await this.authService.login(email, password, res);
  }

  @Post('/logout')
  @UseGuards(JwtUserGuard)
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

  @Put('/register')
  async register(@Body() { email, name, surname }: RegisterUserDto) {
    return this.authService.register(email, name, surname);
  }

  @Patch('/confirm/:email/:registerCode')
  async confirmAccount(
    @Param() { email, registerCode }: ConfirmUserParam,
    @Body() { password }: ConfirmUserDto,
  ) {
    return await this.authService.activateAccount(
      email,
      password,
      registerCode,
    );
  }
}
