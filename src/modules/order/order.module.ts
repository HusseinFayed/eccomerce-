import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../models/category.model';
import { Product, ProductSchema } from '../../models/product.model';

import { UserModule } from '../users/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';


@Module({
  imports: [UserModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ])
  ],

  providers: [OrderService],
  controllers: [OrderController],

})
export class OrderModule { }