import { IsInt, IsNotEmpty, Min } from "class-validator";

export class ProductDto {
    @IsNotEmpty({ message: 'Product Must Have Arabic Name'})
    name_ar: string;


    @IsNotEmpty({ message: 'Product Must Have English Name'})
    name_en: string;

    @IsNotEmpty({ message: 'Please Enter Product Stock'})
    @IsInt()
    @Min(0)
    stock: number;

    @IsNotEmpty({ message: 'Please Enter Product Price'})
    @IsInt()
    @Min(1)
    price:number;

    @IsNotEmpty({ message: 'Please Enter Product Category ID'})
    categoryId: string

}