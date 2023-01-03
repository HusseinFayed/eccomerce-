import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { Category, CategorySchema } from "./category.model";

export type ProductDocument = Product & Document;

@Schema({timestamps: true})
export class Product {
    
    @Prop()
    name_ar: string;

    @Prop()
    name_en: string;

    @Prop()
    stock: number;

    @Prop()
    price: number;

    @Prop({ type: mongoose.Schema.Types.Array, ref: Product.name })
    category: Category

}

export const ProductSchema = SchemaFactory.createForClass(Product);