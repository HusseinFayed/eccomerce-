import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, 
    ParseIntPipe, Patch, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductService } from 'src/product/product.service';
import { CartDto } from './cart.dto';
import { CartService } from './cart.service';
import { Order } from './order.model';

@Controller()

export class CartController{
    constructor(private cartService: CartService,
        private productService: ProductService){}

    @Post('add-to-cart')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createCart(@Req() req,@Body()cart: CartDto) {
            return await this.cartService.createCart(cart, req)
        }

    @UseGuards(JwtAuthGuard)
    @Patch('edit-cart/:id')
        async editCart(@Req() req,@Param('id') id: string, @Body()cart:CartDto){
            
            const cartCheck = await this.cartService.getCartById(id)
            if(!cartCheck){
                throw new HttpException('No Cart By That Id', HttpStatus.UNAUTHORIZED)
        }
        if(req.user.name !== cartCheck.user_name) {
            throw new HttpException('Not authorized to edit cart', HttpStatus.UNAUTHORIZED)
        }
            return await this.cartService.editCart(id,cart)
    }

    @UseGuards(JwtAuthGuard)
    async makeOrder(@Req() req, @Res() response, @Body()order: Order) {
        const newOrder = await this.cartService.makeOrder(req);
        return response.status(HttpStatus.CREATED).json({
            newOrder
        })  
    }
}