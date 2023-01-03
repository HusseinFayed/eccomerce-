import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, 
    ParseIntPipe, Post, Put, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryDto } from './category.dto';
import { Category } from './category.model';
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller()
export class ProductController{
    constructor(private productService: ProductService){}

    @Post('add-category')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createCategory(@Body()category: CategoryDto) {
        return await this.productService.createCategory(category);
    }

    @Get('get-categoryById/:id')
    async getCategoryById(@Param('id') id:string): Promise<Category>{
        return await this.productService.getCategoryById(id)
    }

    @Post('add-product')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createProduct(@Body()product: ProductDto) {
        return await this.productService.createProduct(product);  
    }
}
