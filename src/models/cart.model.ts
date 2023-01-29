import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OBaseEntity } from "../modules/generic/base.entity";
import { Product } from "./product.model";

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart extends OBaseEntity {

    @Prop()
    user_name: string;

    @Prop()
    qty: number;

    @Prop()
    price: number;

    @Prop()
    total_price: number;

    @Prop()
    name_en: string;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Cart.name })
    product: Product

}

export const CartSchema = SchemaFactory.createForClass(Cart);