import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';


@Module({
  imports: [
     MongooseModule.forRoot('mongodb://127.0.0.1:27017/eccomerce'),
     UserModule,
     AuthModule,ProductModule,CartModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}