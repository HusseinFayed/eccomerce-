import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  user_token: string;

  @Prop()
  change_password_token: string;

  @Prop({ default: 0 })
  role: string;

  @Prop({ default: 0 })
  deposit: number;

  // @OneToMany(()=> Cart, (cart)=>cart.user)
  // carts: Cart[]
}

export const UserSchema = SchemaFactory.createForClass(User);