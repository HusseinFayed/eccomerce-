import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';
import { Product, ProductDocument } from '../../models/product.model';
import { CartDto } from '../../dtos/cart.dto';
import { Cart, CartDocument } from '../../models/cart.model';

@Injectable()
export class CartService extends ServiceFactory<Cart>(Cart) {
    constructor(
        @InjectConnection() private connection: Connection
    ) {
        super(connection)
    }
    async createCart(cart: CartDto, req) {

        // const product_check = await this.connection.model<Product>('Product').findOne({ _id: new Types.ObjectId(cart.productId) })
        const product_check = await this.connection.model<Product>('Product').findOne({ name_en: cart.name_en })
        if (!product_check) {
            throw new HttpException('No Product By That Name', HttpStatus.BAD_REQUEST);
        }

        const price = product_check.price

        const product_stock = product_check.stock
        // console.log(product_stock)
        if (product_stock < cart.qty) {
            return "Out Of Stock"
        }
        const newCart = await this.connection.model<Cart>('Cart').create({
            user_name: req.user.name,
            qty: cart.qty,
            name_en: cart.name_en,
            price: price,
            total_price: price * cart.qty,
            product: product_check
        })
        return newCart
    }

    async getProductById(id: string): Promise<Product> {
        return await this.connection.model<Product>('Product').findOne({ _id: id })
    }

    async getCartById(id: string): Promise<Cart> {
        return await this.connection.model<Cart>('Cart').findOne({ _id: id })
    }

    async editCart(id: string, cart: CartDto) {
        await this.connection.model<Cart>('Cart').updateOne({ _id: id }, { qty: cart.qty })
    }

    // async getUserCart(req){

    //     return await this.connection.model<Cart>('Cart').find({where: {username: req.user.name}})
    // }
}       