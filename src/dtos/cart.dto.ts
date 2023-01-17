import { IsNotEmpty } from "class-validator";

export class CartDto {
    @IsNotEmpty({ message: 'Please Enter Product Quantity As An Integer'})
    qty: number;

    @IsNotEmpty({ message: 'Please Enter Product ID As An Integer'})
    productId: string

}