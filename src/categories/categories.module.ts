import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Category.name, schema: CategorySchema },
        { name: Product.name, schema: ProductSchema }
      ],
    ),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
