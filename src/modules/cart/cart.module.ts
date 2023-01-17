import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from '../category/category.service';
import { Category, CategorySchema } from '../../models/category.model';
import { Product, ProductSchema } from '../../models/product.model';
import { ProductService } from '../product/product.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from '../../models/cart.model';
import { CartService } from './cart.service';
import { Order, OrderSchema } from '../../models/order.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
    ],
    providers: [CartService, ProductService, CategoryService],
    controllers: [CartController]
})
export class CartModule { }