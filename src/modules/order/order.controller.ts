import { Controller, Get, UseGuards } from "@nestjs/common";
import { Body, Delete, HttpCode, Param, Post, Req, UsePipes } from "@nestjs/common/decorators";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { ValidationPipe } from "@nestjs/common/pipes";

import { ControllerFactory } from "../generic/abstract.controller";
import { CategoryDto } from "../../dtos/category.dto";

import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Order } from "src/models/order.model";
import { OrderService } from "./order.service";

@Controller()
export class OrderController extends ControllerFactory<Order>(Order) {
    constructor(private OrderService: OrderService,
        private userService: UsersService
    ) {
        super(OrderService);
    }

    @UseGuards(JwtAuthGuard)
    @Post('make-Order')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async makeOrder(@Req() req) {
        return await this.OrderService.makeOrder(req);
    }

}