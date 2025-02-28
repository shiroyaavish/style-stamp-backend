import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminAuthDto,
  CreateAuthDto,
  loginAuthDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import { AuthInfo, AuthInfoDocument } from 'src/user/entities/authInfo.entity';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Admin, AdminDocument } from 'src/user/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(AuthInfo.name) private authInfoModel: Model<AuthInfoDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
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
      password:newPassword
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

  async sendOTP(sendotpDto) {}

  async login(loginAuthDto: loginAuthDto) {
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
      $or: [{ mobileNumber: mobileNumber},{ email: email }],
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
      { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '7d' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: uuid, role: 'Admin' },
      {
        secret: this.configService.get<string>('REFRESH_SECRET'),
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

  findOne(req) {
    return `This action returns a #${req['user']} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
