import {
    Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param,
    ParseIntPipe, Patch, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ControllerFactory } from '../generic/abstract.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductService } from '../product/product.service';
import { CartDto } from '../../dtos/cart.dto';
import { Cart } from '../../models/cart.model';
import { CartService } from './cart.service';
import { Order } from '../../models/order.model';

@Controller()

export class CartController extends ControllerFactory<Cart>(Cart) {
    constructor(private cartService: CartService,
        private productService: ProductService) {
        super(CartService, ProductService)
    }

    @Post('add-to-cart')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createCart(@Req() req, @Body() cart: CartDto) {
        return await this.cartService.createCart(cart, req)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('edit-cart/:id')
    async editCart(@Req() req, @Param('id') id: string, @Body() cart: CartDto) {

        const cartCheck = await this.cartService.getCartById(id)
        if (!cartCheck) {
            throw new HttpException('No Cart By That Id', HttpStatus.UNAUTHORIZED)
        }
        if (req.user.name !== cartCheck.user_name) {
            throw new HttpException('Not authorized to edit cart', HttpStatus.UNAUTHORIZED)
        }
        return await this.cartService.editCart(id, cart)
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('get-user-cart')
    // async getUserCart(@Req() req,){
    //     console.log(req.user.name)
    //     return await this.cartService.getUserCart(req)
    // }
}