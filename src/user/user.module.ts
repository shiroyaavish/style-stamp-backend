import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuthInfo, authInfoSchema } from './entities/authInfo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: AuthInfo.name, schema: authInfoSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
