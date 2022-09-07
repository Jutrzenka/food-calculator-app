import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwtUser.strategy';
import { v4 as uuid } from 'uuid';
import configuration from '../../Utils/config/configuration';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel(User.name)
    private authModel: Model<UserDocument>,
  ) {}

  public createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 20;
    const accessToken = sign(payload, configuration().server.secretKey, {
      expiresIn,
    });
    return {
      accessToken,
      expiresIn,
    };
  }

  public async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.authModel.findOne({ accessToken: token });
    } while (!!userWithThisToken);
    await this.authModel.findOneAndUpdate(
      { idUser: user.idUser },
      { accessToken: token },
    );
    return token;
  }
}
