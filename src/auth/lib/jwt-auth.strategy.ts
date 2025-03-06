import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import e from 'express';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { AuthInfo, AuthInfoDocument } from 'src/user/entities/authInfo.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Admin, AdminDocument } from 'src/user/entities/admin.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthInfo.name) private authInfoModel: Model<AuthInfoDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret'),
      passReqToCallback: true,
    });
  }
  async validate(req: e.Request, payload: any, done: VerifiedCallback) {
    this.logger.log(`decode Token ===== `, JSON.stringify(payload));
    // let authHeader = req.headers.authorization;
    // authHeader = (authHeader.split(' ')[1]) as any
    // console.log(authHeader);

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const authInfo = await this.authInfoModel.findOne({
      uniqueId: payload['id'],
      accessToken: accessToken,
    });
    // console.log(authInfo ,payload,req);

    if (!authInfo) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
    const checkUser = await this.userModel.findById(authInfo.userId).exec();
    if (!checkUser) {
      throw new UnauthorizedException('User Not Found !!');
    }

    return {
      id: checkUser['_id'].toString(),
      name: checkUser['name'],
      mobileUmber: checkUser['mobileNumber'],
    };
  }
}
