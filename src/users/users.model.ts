import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  user_token: string;

  @Prop()
  change_password_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);