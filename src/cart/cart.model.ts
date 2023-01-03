import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { Product } from "src/product/product.model";

export type CartDocument = Cart & Document;

@Schema({timestamps: true})
export class Cart {
    
    @Prop()
    user_name: string;

    @Prop()
    qty: string;

    @Prop()
    price: number;

    @Prop()
    total_price: number;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Cart.name})
    product: Product

    // @Prop({ type: mongoose.Schema.Types.Array, ref: Product.name })
    // category: Category

}

export const CartSchema = SchemaFactory.createForClass(Cart);