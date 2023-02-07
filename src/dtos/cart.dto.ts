import { IsNotEmpty } from "class-validator";

export class CartDto {
    @IsNotEmpty({ message: 'Please Enter Product Quantity As An Integer'})
    qty: number;

    @IsNotEmpty({ message: 'Please Enter Product name_en'})
    name_en: string

}