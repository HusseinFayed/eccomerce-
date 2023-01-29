import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OBaseEntity } from "src/modules/generic/base.entity";

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log extends OBaseEntity{

    @Prop()
    context: string;

    @Prop()
    message: string;

    @Prop()
    level: number;

    @Prop()
    created_at: Date;

}

export const LogSchema = SchemaFactory.createForClass(Log);