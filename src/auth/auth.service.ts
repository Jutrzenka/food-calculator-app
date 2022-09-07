import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { UserTokenService } from './authorization-token/user-token.service';
import { User, UserDocument } from './schema/user.schema';
import { generateUUID } from '../Utils/function/generateUUID';
import { decryption, encryption } from '../Utils/function/bcrypt';
import configuration from '../Utils/config/configuration';
import {
  generateElementResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';

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
    return generateSuccessResponse();
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
      return generateSuccessResponse();
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          'This email or login is existed',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(user: User, res: Response) {
    try {
      await this.authModel.findOneAndUpdate(
        { idUser: user.idUser },
        { accessToken: null },
      );
      res.clearCookie('session-food-calc', {
        secure: configuration().server.ssl,
        domain: configuration().server.domain,
        httpOnly: true,
      });
      return res.status(200).json(generateSuccessResponse());
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginOrEmail, password, res) {
    try {
      const user = await this.authModel.findOne({
        $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      });
      const isUser = await decryption(password, user.password);
      if (!isUser) {
        throw new HttpException(
          'This user is not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const token = this.tokenService.createToken(
        await this.tokenService.generateToken(user),
      );
      return res
        .status(200)
        .cookie('session-food-calc', token.accessToken, {
          secure: configuration().server.ssl,
          domain: configuration().server.domain,
          maxAge: 1000 * 60 * 20,
          httpOnly: true,
        })
        .json(
          generateElementResponse('object', {
            id: user.idUser,
            login: user.login,
          }),
        );
    } catch (e) {
      throw new HttpException('This user is not found', HttpStatus.BAD_REQUEST);
    }
  }
}
