import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { RestStandardError } from '../Utils/class/RestStandardError';
import { JsonCommunicationType } from '../Utils/type/JsonCommunication.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserTokenService))
    private tokenService: UserTokenService,
  ) {}

  async activateAccount(
    email: string,
    password: string,
    registerCode: string,
  ): Promise<JsonCommunicationType> {
    const hashPassword = await encryption(password);
    if (!hashPassword.status) {
      throw new Error(hashPassword.error);
    }
    const filter = {
      email,
      registerCode,
    };
    const updateData = {
      password: hashPassword.data,
      registerCode: null,
      activeAccount: true,
    };
    const status = await this.authModel.updateOne(filter, updateData, {
      new: true,
    });
    if (status.modifiedCount === 0) {
      throw new RestStandardError(
        'This user is not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return generateSuccessResponse();
  }

  async register(
    email: string,
    name: string,
    surname: string,
  ): Promise<JsonCommunicationType> {
    try {
      await this.authModel.create({
        idUser: generateUUID(),
        email: email.toLowerCase().trim(),
        name,
        surname,
        activeAccount: false,
        registerCode: generateUUID(),
      });
      return generateSuccessResponse();
    } catch (err) {
      if (err.code === 11000) {
        throw new RestStandardError(
          'This email or login is existed',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(user: User, res: Response): Promise<JsonCommunicationType> {
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
      res.json(generateSuccessResponse());
    } catch (e) {
      throw new RestStandardError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return generateSuccessResponse();
  }

  async login(email, password, res): Promise<JsonCommunicationType> {
    try {
      const user = await this.authModel.findOne({
        email,
      });
      const isUser = await decryption(password, user.password);
      if (!isUser) {
        throw new RestStandardError(
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
            email: user.email,
          }),
        );
    } catch (e) {
      throw new RestStandardError(
        'This user is not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
