
import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Product, ProductSchema } from "./product.model";
import { Type } from "class-transformer";

export type CategoryDocument = Category & Document;

@Schema({timestamps: true})
export class Category {

    @Prop()
    name_ar: string;

    @Prop()
    name_en: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);