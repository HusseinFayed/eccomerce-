import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';
import { CategoryDto } from '../../dtos/category.dto';
import { Category, CategoryDocument } from '../../models/category.model';


@Injectable()
export class CategoryService extends ServiceFactory<Category>(Category) {
    constructor(
        @InjectConnection() private connection: Connection
    ) {
        super(connection)
    }

    async createCategory(category: CategoryDto) {
        const newCategory = await this.connection.model<Category>('Category').create(category)
        return newCategory
    }

    async getCategoryById(id: string): Promise<Category> {
        return await this.connection.model<Category>('Category').findById(id)
    }

    async getCategoryByName_en(name_en: string): Promise<Category> {
        return await this.connection.model<Category>('Category').findOne({ name_en: name_en })
    }

    async deleteCategory(name_en: string): Promise<void> {
        await this.connection.model<Category>('Category').deleteOne({ name_en: name_en })
    }


}