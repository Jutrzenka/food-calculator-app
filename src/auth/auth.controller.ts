import { Body, Controller, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { UserObj } from '../Utils/decorator/userobj.decorator';
import { AuthService } from './auth.service';
import { User } from './schema/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { ConfirmUserParam } from './dto/confirm-user.param';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() { loginOrEmail, password }: LoginUserDto,
    @Res() res: Response,
  ) {
    await this.authService.login();
  }

  @Post('/logout')
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout();
  }

  @Put('/register')
  async register(@Body() { login, email, name, surname }: RegisterUserDto) {
    return this.authService.register(login, email, name, surname);
  }

  @Patch('/confirm/:login/:registerCode')
  async confirmAccount(
    @Param() { login, registerCode }: ConfirmUserParam,
    @Body()
    { newLogin, password }: ConfirmUserDto,
  ) {
    return await this.authService.activateFullAccount(
      login,
      newLogin,
      password,
      registerCode,
    );
  }
}
