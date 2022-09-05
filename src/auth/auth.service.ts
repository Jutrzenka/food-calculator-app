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
import { encryption } from '../Utils/function/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserTokenService))
    private tokenService: UserTokenService,
  ) {}

  async activateAccount(
    login: string,
    newLogin: string,
    password: string,
    registerCode: string,
  ) {
    const hashPassword = await encryption(password);
    if (!hashPassword.status) {
      throw new Error(hashPassword.error);
    }
    const filter = {
      login,
      registerCode,
    };
    const updateData = {
      login: newLogin,
      password: hashPassword.data,
      registerCode: null,
      activeAccount: true,
    };
    const status = await this.authModel.updateOne(filter, updateData, {
      new: true,
    });
    if (status.modifiedCount === 0) {
      throw new HttpException('This user is not found', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: 200,
      message: 'Success',
    };
  }

  async register(email: string, name: string, surname: string) {
    try {
      await this.authModel.create({
        idUser: generateUUID(),
        email: email.toLowerCase().trim(),
        login: email.toLowerCase().trim(),
        name,
        surname,
        activeAccount: false,
        registerCode: generateUUID(),
      });
      return {
        statusCode: 200,
        message: 'Success',
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
