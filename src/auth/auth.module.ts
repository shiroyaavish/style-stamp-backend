import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { AuthInfo, authInfoSchema } from 'src/user/entities/authInfo.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './lib/jwt-auth.strategy';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    MongooseModule.forFeature([{name:AuthInfo.name,schema:authInfoSchema}]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d'
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService,ConfigService,JwtStrategy],
})
export class AuthModule {}
