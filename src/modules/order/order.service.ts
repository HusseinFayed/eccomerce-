import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';
import { Order } from 'src/models/order.model';
import { Cart } from 'src/models/cart.model';
import { Product } from 'src/models/product.model';
import { Recipe } from 'src/models/recipe.model';
import { User } from 'src/models/users.model';


@Injectable()
export class OrderService extends ServiceFactory<Order>(Order) {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {
        super(connection)
    }
    async getRecipeById(id: string): Promise<Recipe> {
        return await this.connection.model<Recipe>('Recipe').findOne({ _id: new Types.ObjectId(id) });
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

            const sellerName = await this.connection.model<Product>('Product')
                .find({ name_en: product[0].name_en })
                .select('user').exec()
            console.log('Seller Name:', sellerName[0].user[0]);

            var qty = await this.connection.model<Cart>('Cart')
                .find({ user_name: user_name, name_en: product[0].name_en })
                .select('qty').exec()
            qty = JSON.parse(JSON.stringify(qty))
            console.log('Quantity =', qty[0].qty);

            const updated_stock = Number(stock[0].stock) - Number(qty[0].qty)
            if (updated_stock < 0)
                return "Out Of Stock"
            console.log('Updated Stock =', updated_stock);

            await this.connection.model<Product>('Product')
                .updateOne({ name_en: product[0].name_en }, { stock: updated_stock })

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
                order_number: order_number,
                sellerName: sellerName[0].user[0],
            })

            await this.connection.model<Cart>('Cart').deleteOne({ user_name: user_name })

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
            .find({ user_name: user_name })
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
                { $group: { _id: null, TotalSum: { $sum: '$total_price' } } }
            ])
        console.log("Total Recipe", total_recipe[0].TotalSum);

        if (userOldDeposit[0].deposit < total_recipe[0].TotalSum) {
            throw new HttpException('You Dont have enough CREDIT', HttpStatus.BAD_REQUEST)
        }

        const updatedBuyerDeposit = userOldDeposit[0].deposit - total_recipe[0].TotalSum
        console.log('Updated Buyer Deposit =', updatedBuyerDeposit);

        await this.connection.model<User>('User')
            .updateOne({ username: user_name }, { deposit: updatedBuyerDeposit })

        const sellerProduct = await this.connection.model<Order>('Order')
            .find({ order_number: order_number[0].order_number })
            .select('product').exec();
        console.log('Product', sellerProduct);


        sellerProduct.forEach(async (y) => {
            const product = y.product
            console.log('Product', product);

            const user = product[0].user
            console.log('User:', user[0]);

            const oldSellerDeposit = await this.connection.model<User>('User')
                .find({ username: user })
                .select('deposit').exec();
            console.log('Old Seller Deposit', oldSellerDeposit[0].deposit);

            const total_price = await this.connection.model<Order>('Order')
                .find({ sellerName: user[0] })
                .select('total_price').exec()
            console.log('Total price', total_price[0].total_price);

            const newSellerDeposit = +oldSellerDeposit[0].deposit + +total_price[0].total_price
            console.log('New Seller Deposit =', newSellerDeposit);

            await this.connection.model<User>('User').updateOne({ username: user }, { deposit: newSellerDeposit })

            await this.connection.model<Recipe>('Recipe').updateOne({ user_name: user_name }, { status: 'PAID' })


        })
    }

    async printRecipe(id): Promise<Order[]> {
        var user_name = await this.connection.model<Recipe>('Recipe')
            .find({ _id: id }).select('user_name').exec()
        console.log('User Name:', user_name);

        const order_number = await this.connection.model<Recipe>('Recipe')
            .find({ _id: id }).select('order_number').exec()
        console.log("Order Number :", order_number)

        const orders = await this.connection.model<Order>('Order').find({ order_number: order_number[0].order_number })
        return (orders)
    }

    async findAllRecipes(): Promise<Recipe[]> {
        return await this.connection.model<Recipe>('Recipe').find({})
    }

    async findAllOrders(): Promise<Order[]> {
        return await this.connection.model<Order>('Order').find({})
    }

    async getSellerOrders(req) {
        const seller_name = req.user.name;
        console.log('User: ', seller_name);
        const orders = await this.connection.model<Order>('Order').find({ sellerName: seller_name }).exec();
        console.log(orders);

        const total_seller_income = await this.connection.model<Order>('Order')
            .aggregate([
                { $match: { sellerName: seller_name } },
                { $group: { _id: null, TotalSum: { $sum: '$total_price' } } }
            ])
        console.log('Total Seller Income', total_seller_income.at(0)['TotalSum'])
    }

}
