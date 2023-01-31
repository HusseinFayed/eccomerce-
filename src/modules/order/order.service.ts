import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';

import { Order } from 'src/models/order.model';
import { Cart } from 'src/models/cart.model';
import { Product } from 'src/models/product.model';
import { Recipe } from 'src/models/recipe.model';
import { User } from 'src/models/users.model';
import { IsNumber } from 'class-validator';


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
        console.log('Order Number =', order_number);

        const newRecipe = await this.connection.model<Recipe>('Recipe').create({
            user_name: user_name,
            order_number: order_number,
            status: 'PENDING',
        })

        const user_product = await this.connection.model<Cart>('Cart')
            .find({ user_name: user_name })
            .select('product').exec()


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
            //     .updateOne({ name_en: product[0].name_en }, { stock: updated_stock })

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

            // await this.connection.model<Cart>('Cart').deleteOne({ user_name: user_name })

            var recipe_number = await this.connection.model<Recipe>('Recipe')
                .findOne({ order_number: order_number })
                .select('_id').exec();
            recipe_number = JSON.parse(JSON.stringify(recipe_number))._id
            console.log('Recipe Number =', recipe_number);
            await this.connection.model<Order>('Order')
                .updateMany({ order_number: order_number }, { recipe_number: recipe_number })

        });


    }
    async confirmOrder(req) {
        const user_name = req.user.name
        console.log("User: ", user_name)

        const order_number = await this.connection.model<Order>('Order')
            .findOne({ user_name: user_name })
            .select('order_number').exec();
        console.log("Order Number :", order_number)

        var userOldDeposit = await this.connection.model<User>('User')
            .find({ username: user_name })
            .select('deposit').exec()

        userOldDeposit = JSON.parse(JSON.stringify(userOldDeposit))
        console.log("User Old Deposit =", userOldDeposit[0].deposit);

        var total_recipe = await this.connection.model<Order>('Order')
            .aggregate([
                { $match: { user_name: user_name } },
                { $group: { _id: null, TotalSum: { $sum: '$total_price' } } },

            ])
        console.log("Total Recipe", total_recipe[0].TotalSum);

        if (userOldDeposit[0].deposit < total_recipe[0].TotalSum) {
            throw new HttpException('You Dont have enough CREDIT', HttpStatus.BAD_REQUEST)
        }

        const updatedBuyerDeposit = userOldDeposit[0].deposit - total_recipe[0].TotalSum
        console.log('Updated Buyer Deposit =', updatedBuyerDeposit);

        await this.connection.model<User>('User')
            .updateOne({ username: user_name }, { deposit: updatedBuyerDeposit })


        // const oldSellerDeposit = 

        // const newSellerDeposit = 


    }

}





        // const productName = user_product[0].product[0].name_en
        // console.log("Product name", productName)

         // if (userOldDeposit[0].deposit < total_price) {
        //     throw new HttpException('You Dont have enough credit', HttpStatus.BAD_REQUEST)
        // }


         //TODO find seller old deposit and sum old deposit and total price and save in seller new deposit

            // const oldSellerDeposit = await this.connection.model<User>('User')
            // .find({ username:  })
            // .select('deposit').exec()