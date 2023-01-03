import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/product/category.model';
import { Product, ProductSchema } from 'src/product/product.model';
import { ProductService } from 'src/product/product.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './cart.model';
import { CartService } from './cart.service';
import { Order, OrderSchema } from './order.model';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Cart.name, schema: CartSchema}]),
        MongooseModule.forFeature([{name:Product.name, schema: ProductSchema}]),
        MongooseModule.forFeature([{name:Category.name, schema: CategorySchema}]),
        MongooseModule.forFeature([{name:Order.name, schema: OrderSchema}])
    ],
    providers: [CartService,ProductService],
    controllers: [CartController]
})
export class CartModule {}