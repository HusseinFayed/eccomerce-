import { Controller, Get, UseGuards } from "@nestjs/common";
import { Body, Delete, HttpCode, Param, Post, Render, Req, Res, UsePipes } from "@nestjs/common/decorators";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { ValidationPipe } from "@nestjs/common/pipes";

import { ControllerFactory } from "../generic/abstract.controller";
import { CategoryDto } from "../../dtos/category.dto";

import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Order } from "src/models/order.model";
import { OrderService } from "./order.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags('Order')

export class OrderController extends ControllerFactory<Order>(Order) {
    constructor(private orderService: OrderService,
        private userService: UsersService
    ) {
        super(OrderService);
    }

    @UseGuards(JwtAuthGuard)
    @Post('make-Order')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async makeOrder(@Req() req) {
        return await this.orderService.makeOrder(req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm-Order')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async confirmOrder(@Req() req) {
        return await this.orderService.confirmOrder(req);
    }

    @Get('print-recipe/:id')
    @Render('print-recipe')
    async printRecipe(@Param('id') id) {
        const recipe = await this.orderService.getRecipeById(id)
        if (!recipe) {
            throw new HttpException('No Recipe By That Id', HttpStatus.BAD_REQUEST)
        }
        return await this.orderService.printRecipe(id)
            .then((result) => result ? { orders: result } : { orders: [] });
    }

    @Get('get-recipes')
    @Render('recipe-table')
    findAllRecipes() {
        return this.orderService.findAllRecipes().then((result) => result ? { recipes: result } : { recipes: [] });
    }

    @Get('get-orders')
    @Render('order-table')
    findAllOrders() {
        return this.orderService.findAllOrders().then((result) => result ? { orders: result } : { orders: [] });
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-seller-orders')
    async getSellerOrders(@Req() req) {
        return await this.orderService.getSellerOrders(req)
    }
}