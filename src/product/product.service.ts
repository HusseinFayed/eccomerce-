import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './category.dto';
import { Category, CategoryDocument } from './category.model';
import { ProductDto } from './product.dto';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) {}

    async createCategory(category:CategoryDto){
        const newCategory = new this.categoryModel(category);
        return newCategory.save();
    }

    async getCategoryById(id: string): Promise<Category> {
        // return await this.categoryModel.findOne({ where:{_id:id}, relations: ['products'] });
        return await this.categoryModel.findById(id)
    }    

    async createProduct(product: ProductDto){
        const category = await this.getCategoryById(product.categoryId)
        const newProduct = new this.productModel({
            name_ar: product.name_ar,
            name_en: product.name_en,
            price: product.price,
            stock: product.stock,
            category: category
        });
        newProduct.save();
        return newProduct

    }

    async getProductById(id: string): Promise<Product> {
        return await this.productModel.findOne({where:{id:id}, relations:['user']})
    }
}
