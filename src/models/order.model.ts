import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OBaseEntity } from "src/modules/generic/base.entity";
import { Product } from "./product.model";

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends OBaseEntity{

    @Prop()
    user_name: string;

    // @Prop()
    // product_id: string;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Order.name })
    product: Product

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

    @Prop()
    sellerName: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);