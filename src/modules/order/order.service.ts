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

            const qty = await this.connection.model<Cart>('Cart')
                .find({ user_name: user_name, name_en: product[0].name_en })
                .select('qty').exec()
            console.log('Quantity =', qty[0].qty);

            const updated_stock = Number(stock[0].stock) - Number(qty[0].qty)
            if (updated_stock < 0)
                return "Out Of Stock"
            console.log('Updated Stock =', updated_stock);

            // await this.connection.model<Product>('Product')
            // .updateOne({name_en:product[0].name_en}, {stock: updated_stock})




        });















        // const newOrder = await this.connection.model<Order>('Order').create({
        //     user_name: user_name,
        //     // product_id: ,
        //     qty: qty,
        // })

    }




}