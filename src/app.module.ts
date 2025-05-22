import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import LogsMiddleware from './middlewares/logs.middleware';
import { validate } from 'config/env.validation';
import { CategoriesModule } from './categories/categories.module';
import mongoose from 'mongoose';
import configuration from 'config/configuration';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './products/products.module';
import { AttributesModule } from './attributes/attributes.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { CartsModule } from './carts/carts.module';
import { DatabaseModule } from './database/database.module';

mongoose.set('debug', true);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration], // Load centralized config
      validate, // Validate environment variables
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        autoIndex: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    InquiriesModule,
    CategoriesModule,
    SharedModule,
    ProductsModule,
    AttributesModule,
    OrderModule,
    TransactionModule,
    CartsModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
