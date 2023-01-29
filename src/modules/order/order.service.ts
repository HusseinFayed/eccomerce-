import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';

import { Order } from 'src/models/order.model';
import { Cart } from 'src/models/cart.model';
import { Product } from 'src/models/product.model';


@Injectable()
export class OrderService extends ServiceFactory<Order>(Order) {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {
        super(connection)
    }

    async makeOrder(req) {

        const user_name = req.user.name
        console.log("User: ", user_name)
        const order_number = Math.floor((Math.random() * 1000) + 1)
        console.log('Order Number =',order_number);
        
        const user_product = await this.connection.model<Cart>('Cart')
            .find({ user_name: user_name })
            .select('product').exec()

        // const productName = user_product[0].product[0].name_en
        // console.log("Product name", productName)

        user_product.forEach(async (x) => {
            const product = x.product
            console.log('Product', product);

            const stock = await this.connection.model<Product>('Product')
                .find({ name_en: product[0].name_en })
                .select('stock').exec()
            console.log('Stock =', stock[0].stock);

            var qty = await this.connection.model<Cart>('Cart')
                .find({ user_name: user_name, name_en: product[0].name_en })
                .select('qty').exec()
            qty = JSON.parse(JSON.stringify(qty))
            console.log('Quantity =', qty[0].qty);

            const updated_stock = Number(stock[0].stock) - Number(qty[0].qty)
            if (updated_stock < 0)
                return "Out Of Stock"
            console.log('Updated Stock =', updated_stock);

            // await this.connection.model<Product>('Product')
            // .updateOne({name_en:product[0].name_en}, {stock: updated_stock})

            const price = await this.connection.model<Cart>('Cart')
                .find({ user_name: user_name, name_en: product[0].name_en }).select('price').exec()
            console.log('Price =', price[0].price);

            const total_price = price[0].price * qty[0].qty
            console.log('Total Price =', total_price);

            const newOrder = await this.connection.model<Order>('Order').create({
            user_name: user_name,
            product: product,
            qty: qty[0].qty,
            price: price[0].price,
            total_price: total_price,
            order_number: order_number
        })

        // await this.connection.model<Cart>('Cart').deleteOne({user_name:user_name})

        
        // var recipe_numberObj = await this.recipeModel.findOne({ order_number: order_number }).select('_id').exec();
        //     const recipe_number=JSON.parse(JSON.stringify(recipe_numberObj))._id
        //     console.log('Recipe Number =',recipe_number);

        //     await this.orderModel.updateMany({ order_number: order_number } , { recipe_number: recipe_number })


        });     

    }




}