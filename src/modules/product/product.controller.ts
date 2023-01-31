import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param,
    ParseIntPipe, Post, Put, Req, Res, UsePipes, ValidationPipe
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ControllerFactory } from '../generic/abstract.controller';
import { ProductDto } from '../../dtos/product.dto';
import { Product } from '../../models/product.model';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Product')

export class ProductController extends ControllerFactory<Product>(Product) {
    constructor(private productService: ProductService,
        private userService: UsersService
    ) {
        super(ProductService);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-product')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createProduct(@Req() req, @Body() product: ProductDto) {
        const user = await this.userService.getUserByUserName(req.user.name)
        if (user.role == '0') {
            throw new HttpException('Buyer cant insert category', HttpStatus.UNAUTHORIZED)
        }
        return await this.productService.createProduct(product, req);
    }

    @Get('get-productById/:id')
    @HttpCode(200)
    async getProductById(@Param('id') id: string): Promise<Product> {
        const product = await this.productService.getProductById(id)
        if (!product) {
            throw new HttpException('No product By That name', HttpStatus.BAD_REQUEST)
        }
        return product
    }

    @Get('get-productByName_en/:name_en')
    @HttpCode(200)
    async getProductByName_en(@Param('name_en') name_en: string): Promise<Product> {
        const product = await this.productService.getProductByName_en(name_en)
        if (!product) {
            throw new HttpException('No product By That name', HttpStatus.BAD_REQUEST)
        }
        return product
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-productByName_en/:name_en')
    async deleteProduct(@Req() req,@Param('name_en') name_en: string): Promise<void> {
        const product = await this.productService.getProductByName_en(name_en)
        if (!product) {
            throw new HttpException('No product By That name', HttpStatus.BAD_REQUEST)
        }
        if( req.user.name !== product.user[0]){
            throw new HttpException('The username from bearer token in not the same to the product user', HttpStatus.UNAUTHORIZED)
        }
        return await this.productService.deleteProduct(name_en);
    }
}
