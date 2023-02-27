
import { Injectable, ValidationPipe, ValidationPipeOptions, Type, ArgumentMetadata, Post, UsePipes, Body, Get, Param, Query, Patch, Put, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
// import { PaginationRequest } from "../dtos/pagination.request";
// import { PaginationResponse } from "../dtos/pagination.response";
// import { JwtAuthGuard } from "../modules/guards/jwt-auth.guard";
import { AbstractValidationPipe } from "./abstract-validation.pipe";
import { ServiceFactory } from './abstract.service';



export function ControllerFactory<E>(
    model: Type<E>
): any {

    class AbstractController<E> {
        constructor(private service) {

        }

        @Post()
        // @UseGuards(JwtAuthGuard)
        @ApiBody({ type: model })
        @ApiResponse({ type: model })
        async saveOne(@Body() body: E): Promise<E> {
            return this.service.saveOne(body);
        }



        @Get()
        // @UseGuards(JwtAuthGuard)
        // @ApiQuery({type:()=>PaginationRequest,required:false})
        async findAll(): Promise<E[]> {
            let result = await this.service.findAll();
            return result;
        }


        // @UseGuards(JwtAuthGuard)
        // @Get('exists/:code')
        // existsByCode(@Param('code') code: string): Promise<boolean> {
        //     return this.service.existsByCode(code);
        // }


        @Get('count')
        // @UseGuards(JwtAuthGuard)
        async count(): Promise<number> {
            return this.service.count();
        }

        // @Get(':id')
        // // @UseGuards(JwtAuthGuard)
        // @ApiResponse({ type: model })
        // async findById(@Param('id') id: string,): Promise<E> {
        //     return this.service.findById(id);
        // }

        @Put(':id')
        // @UseGuards(JwtAuthGuard)
        @ApiBody({ type: model })
        @ApiResponse({ type: model })
        async updateOne(@Param('id') id: string, @Body() body: E): Promise<E> {
            return this.service.updateOne(id, body);
        }

        @Delete(':id')
        // @UseGuards(JwtAuthGuard)
        async deleteOne(@Param('id') id: string): Promise<E> {
            return this.service.deleteOne(id);
        }
    }

    return AbstractController;
}
