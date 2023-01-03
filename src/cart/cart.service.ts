import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/product/product.model';
import { CartDto } from './cart.dto';
import { Cart, CartDocument } from './cart.model';

@Injectable()
export class CartService {
    constructor(    
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        
    ) {}
    async createCart(cart: CartDto, req) {
       
        const product_check = await this.productModel.findOne({_id: new Types.ObjectId(cart.productId)})
        if(!product_check) {
            throw new HttpException('No Product By That ID', HttpStatus.BAD_REQUEST);
        }
        // const productss = await this.productModel.findOne({_id:cart.productId})
        const price = product_check.price
        // const product = await this.getProductById(cart.productId)
        const product_stock = product_check.stock
        console.log(product_stock)
        if (product_stock < cart.qty) {
            return "Out Of Stock"
        }
        const newCart = new this.cartModel({
            user_name: await req.user.name,
            qty: cart.qty,
            productId: cart.productId,
            price: price,
            total_price: price*cart.qty,
            product: product_check
        })
        newCart.save();
        return newCart
    }

    async getProductById (id:string): Promise<Product> {
        return await this.productModel.findOne({_id:id})
    }

    async getCartById (id:string): Promise<Cart> {
        return await this.cartModel.findOne({_id:id})
    }

    async editCart(id:string, cart:CartDto){
        await this.cartModel.updateOne({ _id: id } , { qty:cart.qty  })
    }
    
    public async makeOrder(req) {
        
    }
}