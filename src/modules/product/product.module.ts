import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from '../category/category.service';
import { Category, CategorySchema } from '../../models/category.model';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from '../../models/product.model';
import { ProductService } from './product.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
    // {name: Cart.name, schema: CartSchema},
    { name: Category.name, schema: CategorySchema },
    ])
  ],

  providers: [ProductService, CategoryService],
  controllers: [ProductController]
})
export class ProductModule { }