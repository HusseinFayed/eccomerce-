import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../models/category.model';
import { Product, ProductSchema } from '../../models/product.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UserModule } from '../users/user.module';


@Module({
  imports: [UserModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ])
  ],

  providers: [CategoryService],
  controllers: [CategoryController],

})
export class CategoryModule { }