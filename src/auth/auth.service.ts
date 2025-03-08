import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminAuthDto,
  CreateAuthDto,
  LoginAuthDto,
  SendotpDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import { AuthInfo, AuthInfoDocument } from 'src/user/entities/authInfo.entity';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Admin, AdminDocument } from 'src/user/entities/admin.entity';
import { TwilioService } from 'src/shared/services/twilio.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(AuthInfo.name) private authInfoModel: Model<AuthInfoDocument>,
    private readonly twilioService: TwilioService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async create(createAuthDto: CreateAuthDto) {
    const { name, mobileNumber, countryCode, countryCodeEmoji, email } =
      createAuthDto;
    if (!mobileNumber || !email) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Fill All Required Details',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isExistMobile = await this.userModel.findOne({ mobileNumber });
    if (isExistMobile) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'MobileNumber is used once.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new this.userModel({
      name: name,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      countryCodeEmoji: countryCodeEmoji,
      email: email,
    });
    await newUser.save();
    // console.log(newUser);

    return {
      status: HttpStatus.OK,
      message: 'User Register successfully',
      data: {
        name,
        mobileNumber,
        countryCode,
        countryCodeEmoji,
        email,
      },
    };
  }

  async adminCreate(adminAuthDto: AdminAuthDto) {
    const {
      name,
      mobileNumber,
      countryCode,
      countryCodeEmoji,
      email,
      password,
    } = adminAuthDto;
    if (!mobileNumber || !email) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Fill All Required Details',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isExistMobile = await this.userModel.findOne({
      $or: [{ mobileNumber }, { email }],
    });
    if (isExistMobile) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'MobileNumber is used once.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPassword = hashSync(password, 10);
    const newUser = new this.adminModel({
      name: name,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      countryCodeEmoji: countryCodeEmoji,
      email: email,
      password: newPassword,
    });
    await newUser.save();
    // console.log(newUser);

    return {
      status: HttpStatus.OK,
      message: 'User Register successfully',
      data: {
        name,
        mobileNumber,
        countryCode,
        countryCodeEmoji,
        email,
      },
    };
  }

  async sendOTP(sendotpDto: SendotpDto) {
    const { mobileNumber, countryCode } = sendotpDto;
    const user = await this.userModel.findOne({ mobileNumber: mobileNumber });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: "You're not registred",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (this.configService.get<string>('environment') == 'production') {
      const fullMobileNumber = countryCode + mobileNumber;
      const response = await this.twilioService.sendTwilioVerificationSMS(
        fullMobileNumber.toString(),
      );
      if (response.status) {
        return {
          status: HttpStatus.OK,
          message: 'Otp Send Successfully',
          allAttempts: response.allData,
          mobileNumber: mobileNumber,
        };
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: response.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      user.otp = '111111';
      const date = new Date();
      user.otpExpired = new Date(date.getTime() + 300000);
      await this.userModel
        .findByIdAndUpdate(user.id, user, { new: true })
        .exec();
      return {
        status: HttpStatus.OK,
        message: 'Otp Send Successfully',
        allAttempts: [],
        mobileNumber: mobileNumber,
      };
    }
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    const { mobileNumber, otp } = verifyOtpDto;
    const user = await this.userModel.findOne({ mobileNumber: mobileNumber });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: "You're not registred",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (this.configService.get<string>('environment') === 'production') {
      try {
        const mobileNumber = `${user.countryCode}${user.mobileNumber}`;
        const verificationCheck = await this.twilioService.verifyTwilioSMS(
          mobileNumber,
          otp,
        );

        if (verificationCheck.status !== 'approved') {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'OTP Invalid',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (error) {
        console.log(error.message);

        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'OTP Invalid',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (otp !== user.otp || new Date(user.otpExpired) < new Date()) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'OTP Invaid',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const uuid = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { id: uuid },
      {
        secret: this.configService.get<string>('auth.jwtSecret'),
        expiresIn: '7d',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: uuid },
      {
        secret: this.configService.get<string>('auth.refreshSecret'),
        expiresIn: '30d',
      },
    );
    const authInfo = {
      uniqueId: uuid,
      refreshToken,
      accessToken,
      userId: user.id,
      userName: user['name'],
      userMobileNumber: user['mobileNumber'],
    };
    await this.authInfoModel.create(authInfo);
    const loginResponse = {
      userId: user.id,
      mobileNumber: user.mobileNumber,
      countryCode: user.countryCode,
      islogin: user.islogin,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return {
      status: HttpStatus.OK,
      message: 'OTP verify Successfully',
      data: loginResponse,
    };
  }

  async adminLogin(loginAuthDto: LoginAuthDto) {
    const { mobileNumber, email, password } = loginAuthDto;
    if ((!mobileNumber && !email) || !password) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Please Fill Required Fields',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isUser = await this.adminModel.findOne({
      $or: [{ mobileNumber: mobileNumber }, { email: email }],
    });
    // console.log(isUser);

    if (!isUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Mobilenumber or Password must be correct !!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const checkPassword = await compareSync(password, isUser['password']);
    if (!checkPassword) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Mobilenumber or Password must be correct !!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const uuid = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { id: uuid, role: 'Admin' },
      {
        secret: this.configService.get<string>('auth.jwtSecret'),
        expiresIn: '7d',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: uuid, role: 'Admin' },
      {
        secret: this.configService.get<string>('auth.refreshSecret'),
        expiresIn: '30d',
      },
    );
    const authInfo = {
      uniqueId: uuid,
      refreshToken,
      accessToken,
      userId: isUser['_id'].toString(),
      userName: isUser['name'],
      userMobileNumber: isUser['mobileNumber'],
    };
    await this.authInfoModel.create(authInfo);
    return {
      status: HttpStatus.OK,
      message: 'User Login Successfully',
      data: {
        id: authInfo.userId,
        refreshToken,
        accessToken,
        name: isUser['name'],
        mobileNumber: isUser['mobileNumber'],
        countryCode: isUser['countryCode'],
        countryCodeEmoji: isUser['countryCodeEmoji'],
        email: isUser['email'],
      },
    };
  }

  async refreshToken(req: Request, refreshToken) {
    const decodedJwt = this.jwtService.decode(refreshToken) as any;

    if (decodedJwt.exp * 1000 < Date.now()) {
      await this.authInfoModel.findOneAndDelete({ refreshToken: refreshToken });
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Token Not Match',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const authInfo = await this.authInfoModel.findOne({
      uniqueId: decodedJwt.id,
      refreshToken: refreshToken,
    });
    // console.log(authInfo);

    if (!authInfo) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Data Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let user;
    if (decodedJwt?.role == 'Admin') {
      user = await this.adminModel.findById(authInfo.userId);
    } else {
      user = await this.userModel.findById(authInfo.userId);
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const payload = {
      id: authInfo.uniqueId,
      role: decodedJwt?.role ? decodedJwt.role : undefined,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtSecret'),
      expiresIn: '7d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.refreshSecret'),
      expiresIn: '30d',
    });

    await this.authInfoModel
      .findOneAndUpdate(
        { uniqueId: authInfo.uniqueId },
        {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      )
      .exec();

    return {
      status: HttpStatus.OK,
      message: 'Token Generated Successfully',
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async logout(request: Request) {
    let authHeader = request?.['headers']?.['authorization'];
    authHeader = authHeader.split(' ')[1] as any;
    const decodedJwt = this.jwtService.decode(authHeader) as any;

    await this.authInfoModel.findOneAndDelete({
      id: decodedJwt.id,
      accessToken: authHeader,
    });

    return {
      status: HttpStatus.OK,
      message: 'User logged out successfully.',
    };
  }

  findOne(req) {
    return `This action returns a #${req['user']} auth`;
  }
}
