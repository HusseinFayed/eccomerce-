import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({timestamps: true})
export class Order {

    @Prop()
    user_name: string;

    @Prop()
    product_id: string;

    @Prop()
    qty: number;

    @Prop()
    price: number;

    @Prop()
    total_price: number;

    @Prop()
    order_number: number;

    @Prop()
    recipe_number: string;

    
}

export const OrderSchema = SchemaFactory.createForClass(Order);