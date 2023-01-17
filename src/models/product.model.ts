import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { User } from "./users.model";
import { OBaseEntity } from "../modules/generic/base.entity";
import { Category, CategorySchema } from "./category.model";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product extends OBaseEntity {

    // @Prop()
    // _id: string;

    @Prop()
    name_ar: string;

    @Prop()
    name_en: string;

    @Prop()
    stock: number;

    @Prop()
    price: number;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Product.name })
    user: User;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Product.name })
    category: Category

}

export const ProductSchema = SchemaFactory.createForClass(Product);