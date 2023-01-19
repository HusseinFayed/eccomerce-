import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { ServiceFactory } from '../generic/abstract.service';
import { Category, CategoryDocument } from '../../models/category.model';
import { ProductDto } from '../../dtos/product.dto';
import { Product, ProductDocument } from '../../models/product.model';

@Injectable()
export class ProductService extends ServiceFactory<Product>(Product)
{
    constructor(
        private readonly categoryService: CategoryService,
        @InjectConnection() private connection: Connection,
        
    ) {
        super(connection);
    }
    async createProduct(product: ProductDto, req) {
        const category = await this.connection.model<Category>('Category').findOne({ name_en: product.categoryId })
        if (!category) {
            throw new HttpException('No Category By That Name', HttpStatus.BAD_REQUEST);
        }
        const newProduct = await this.connection.model<Product>('Product').create({
            name_ar: product.name_ar,
            name_en: product.name_en,
            price: product.price,
            stock: product.stock,
            category: category,
            user: req.user.name
        });
        return newProduct
    }

    async getProductById(id: string): Promise<Product> {
        return await this.connection.model<Product>('Product').findById(id)

    }

    async getProductByName_en(name_en: string): Promise<Product> {
        return await this.connection.model<Product>('Product').findOne({ name_en: name_en })
    }

    async deleteProduct(name_en: string): Promise<void> {
        await this.connection.model<Product>('Product').deleteOne({ name_en: name_en })
    }
}
