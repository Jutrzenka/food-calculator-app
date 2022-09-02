import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTokenService } from './authorization-token/user-token.service';
import { User, UserDocument } from './schema/user.schema';
import { generateUUID } from '../Utils/function/generateUUID';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserTokenService))
    private tokenService: UserTokenService,
  ) {}
  async activateFullAccount(
    login: string,
    newLogin: string,
    password: string,
    registerCode: string,
  ) {
    throw new Error('Method not implemented.');
  }
  async register(login: string, email: string, name: string, surname: string) {
    try {
      await this.authModel.create({
        idUser: generateUUID(),
        email: email.toLowerCase().trim(),
        login: login.trim(),
        name,
        surname,
        activeAccount: false,
        registerCode: generateUUID(),
      });
      return {
        success: true,
      };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException('Wrong data', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async logout() {
    throw new Error('Method not implemented.');
  }
  async login() {
    throw new Error('Method not implemented.');
  }
}
