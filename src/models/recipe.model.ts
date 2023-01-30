import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RecipeDocument = Recipe & Document;

@Schema({timestamps: true})
export class Recipe {

    @Prop()
    user_name: string;

    @Prop()
    order_number: number;

    @Prop()
    return_number: number;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);