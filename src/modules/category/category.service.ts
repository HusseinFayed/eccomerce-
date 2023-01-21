import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ServiceFactory } from '../generic/abstract.service';
import { CategoryDto } from '../../dtos/category.dto';
import { Category, CategoryDocument } from '../../models/category.model';


@Injectable()
export class CategoryService extends ServiceFactory<Category>(Category) {
    private readonly logger = new Logger(CategoryService.name)
    constructor(
        @InjectConnection() private connection: Connection,
    ) {
        super(connection)
    }

    async createCategory(category: CategoryDto) {
        const newCategory = await this.connection.model<Category>('Category').create(category)
        return newCategory
    }

    async getCategoryById(id: string): Promise<Category> {
        const category = await this.connection.model<Category>('Category').findById(id)
        if(!category) {
            this.logger.warn('Tried to access a cayegory that does not exist');
        }
        return category
    }

    async getCategoryByName_en(name_en: string): Promise<Category> {
        const category = await this.connection.model<Category>('Category').findOne({ name_en: name_en })
        if(!category) {
            this.logger.warn('Tried to access a cayegory that does not exist');
        }
        return category
    }

    async deleteCategory(name_en: string): Promise<void> {
        await this.connection.model<Category>('Category').deleteOne({ name_en: name_en })
    }


}