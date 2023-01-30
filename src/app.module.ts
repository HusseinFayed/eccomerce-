import { Module, MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/databse.module';
import { LoggingModule } from './logging service/logging.module';
import LogsMiddleware from './logging service/logs.middleware';

import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/users/user.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/eccomerce'),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/logs'),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    DatabaseModule,
    UserModule,
    AuthModule, ProductModule, CartModule, CategoryModule,OrderModule,LoggingModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LogsMiddleware)
        .forRoutes('*');
    }
 
}

