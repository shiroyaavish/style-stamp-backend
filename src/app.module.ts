import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import LogsMiddleware from './middlewares/logs.middleware';
import mongoose from 'mongoose';

mongoose.set('debug',true)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[configuration]
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        uri:configService.get<string>("MONGODB_URI"),
        autoIndex:false,
      }),
      inject:[ConfigService]
    }),
    AuthModule,
    UserModule,
    InquiriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
