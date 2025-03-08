import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(request: Request, createCategoryDto: CreateCategoryDto) {
    const { name, image, parentCategoryId } = createCategoryDto;

    const parentCategory = parentCategoryId
      ? await this.categoryModel.findById(parentCategoryId).lean()
      : null;

    const newCategory = await this.categoryModel.create({
      name,
      image,
      parentCategoryId,
      path: [],
    });

    newCategory.path = parentCategory
      ? [...parentCategory?.['path'], String(newCategory._id)]
      : [String(newCategory._id)];

    await newCategory.save();

    return {
      message: 'Category created successfully',
      data: {
        _id: newCategory['_id'],
        name: newCategory['name'],
        image: newCategory['image'],
      },
    };
  }

  async findAll(request: Request) {
    const categories = await this.categoryModel
      .find({ parentCategoryId: null })
      .sort({ name: 1 })
      .select(
        '-parentCategoryId -parentCategoryName -__v -createdAt -updatedAt',
      );
    return {
      status: HttpStatus.OK,
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }

  async findOne(request: Request, id: string): Promise<any> {
    const categories = await this.categoryModel
      .find({ path: { $in: [id] } })
      .select('_id name parentCategoryId')
      .lean();

    if (!categories || categories.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Category not found',
        data: null,
      };
    }

    const updatedData = this.buildCategoryTree(categories);

    return {
      status: HttpStatus.OK,
      message: 'Category retrieved successfully',
      data: updatedData,
    };
  }

  buildCategoryTree(categories: any[]): any {
    // Create a lookup map and initialize children arrays
    const map = {};
    categories.forEach((category) => {
      // Ensure we always use strings for comparisons
      const id = category._id.toString();
      map[id] = { ...category, subcategories: [] };
    });

    const tree = [];

    categories.forEach((category) => {
      const id = category._id.toString();
      if (category.parentCategoryId) {
        // Convert parentCategoryId to string for comparison
        const parentId = category.parentCategoryId.toString();
        // If the parent exists in our map, add this node as a child
        if (map[parentId]) {
          map[parentId]?.subcategories.push(map[id]);
        } else {
          // If parent is not found, it might be a root node or a data issue
          tree.push(map[id]);
        }
      } else {
        // No parentCategoryId means this is a root node
        tree.push(map[id]);
      }
    });

    return tree;
  }

  async update(
    request: Request,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const parentCategory =
      (updateCategoryDto['parentCategoryId'] &&
        (await this.categoryModel.findById(
          updateCategoryDto['parentCategoryId'],
        ))) ||
      null;

    await this.categoryModel.findByIdAndUpdate(id, {
      $set: {
        name: updateCategoryDto['name'],
        image: updateCategoryDto['image'],
        parentCategoryId: updateCategoryDto['parentCategoryId'],
        path: parentCategory && [...parentCategory?.['path'], id],
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Category updated successfully',
    };
  }

  async remove(request: Request, id: string) {
    await this.categoryModel.findByIdAndDelete(id);

    return {
      status: HttpStatus.OK,
      message: 'Category removed successfully',
    };
  }
}
