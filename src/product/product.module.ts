import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.model';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.model';
import { ProductService } from './product.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Product.name, schema: ProductSchema},
            // {name: Cart.name, schema: CartSchema},
            {name: Category.name, schema: CategorySchema},
          ])
  ],
    
    providers: [ProductService],
    controllers: [ProductController]
  })
  export class ProductModule {}