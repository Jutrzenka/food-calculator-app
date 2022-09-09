import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import configuration from '../../Utils/config/configuration';
import { User, UserDocument } from '../schema/user.schema';
import { RestStandardError } from '../../Utils/class/RestStandardError';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.['session-food-calc'] ?? null : null;
}

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwtUser') {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configuration().server.secretKey,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(
        new RestStandardError(
          'Your time in authorization is end',
          HttpStatus.UNAUTHORIZED,
        ),
        false,
      );
    }

    const user = await this.userModel.findOne({
      accessToken: payload.id,
    });

    if (!user) {
      return done(
        new RestStandardError('Unauthorized', HttpStatus.UNAUTHORIZED),
        false,
      );
    }
    done(null, user);
  }
}
