import { Controller, Get, UseGuards } from "@nestjs/common";
import { Body, Delete, HttpCode, Param, Post, Req, UsePipes } from "@nestjs/common/decorators";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { ValidationPipe } from "@nestjs/common/pipes";

import { ControllerFactory } from "../generic/abstract.controller";
import { CategoryDto } from "../../dtos/category.dto";
import { Category } from "../../models/category.model";
import { CategoryService } from "./category.service";
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags('Category')

export class CategoryController extends ControllerFactory<Category>(Category) {
    constructor(private categoryService: CategoryService,
        private userService: UsersService
    ) {
        super(CategoryService);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-category')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createCategory(@Req() req, @Body() category: CategoryDto) {
        const user = await this.userService.getUserByUserName(req.user.name)
        if (user.role == '0') {
            throw new HttpException('Buyer cant insert category', HttpStatus.UNAUTHORIZED)
        }
        return await this.categoryService.createCategory(category);
    }

    @Get('get-categoryById/:id')
    @HttpCode(200)
    async getCategoryById(@Param('id') id: string): Promise<Category> {
        const category = await this.categoryService.getCategoryById(id)
        if (!category) {
            throw new HttpException('No category By That Id', HttpStatus.BAD_REQUEST)
        }
        return category
    }

    @Get('get-categoryByName_en/:name_en')
    @HttpCode(200)
    async getCategoryByName_en(@Param('name_en') name_en: string): Promise<Category> {
        const category = await this.categoryService.getCategoryByName_en(name_en)
        if (!category) {
            throw new HttpException('No category By That Name', HttpStatus.BAD_REQUEST)
        }
        return category
    }

    @Delete('delete-categoryByName_en/:name_en')
    async deleteCategory(@Req() req,@Param('name_en') name_en: string): Promise<void> {
        const category = await this.categoryService.getCategoryByName_en(name_en)
        if (!category) {
            throw new HttpException('No category By That Name', HttpStatus.BAD_REQUEST)
        }
        return await this.categoryService.deleteCategory(name_en);
    }
}