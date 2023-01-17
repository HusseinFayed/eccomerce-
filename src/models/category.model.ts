
import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OBaseEntity } from "../modules/generic/base.entity";

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends OBaseEntity {

    @Prop()
    name_ar: string;

    @Prop()
    name_en: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);