import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async create(request: Request, createCategoryDto: CreateCategoryDto) {
    const { name, image, parentCategoryId, parentCategoryName } = createCategoryDto
    const category = new this.categoryModel({
      name,
      image,
      parentCategoryId,
      parentCategoryName
    })
    await category.save()
    await this.categoryModel.findByIdAndUpdate(parentCategoryId, { $push: { childs: String(category._id) } })
    return {
      message: 'Category created successfully',
      data: category
    }
  }

  async findAll(request: Request) {
    const categories = await this.categoryModel.find({ parentCategoryId: null }).select("-parentCategoryId -parentCategoryName -__v -createdAt -updatedAt")
    return {
      status: HttpStatus.OK,
      message: 'Categories retrieved successfully',
      data: categories
    }
  }

  // async findOne(request: Request, id: string): Promise<any> {
  //   // const categories = await this.categoryModel.aggregate([
  //   //   {
  //   //     $match: { _id: new Types.ObjectId(id) } // Start with the given category
  //   //   },
  //   //   {
  //   //     $graphLookup: {
  //   //       from: "categories", // Collection name
  //   //       startWith: "$childs", // Start with the given category ID
  //   //       connectFromField: "childs", // Match _id of parent
  //   //       connectToField: "_id", // Match parentCategoryId
  //   //       as: "subcategories", // Store all children in this array
  //   //       // maxDepth:9
  //   //     }
  //   //   }
  //   // ]);
  //   // const categories = await this.categoryModel.aggregate([
  //   //   {
  //   //     $lookup: {
  //   //       from: "categories",
  //   //       localField: "_id",
  //   //       foreignField: "parentCategoryId",
  //   //       as: "children"
  //   //     }
  //   //   },
  //   //   {
  //   //     $match: {
  //   //       children: { $eq: [] }
  //   //     }
  //   //   },
  //   //   // {
  //   //   //   $match: {
  //   //   //     name: { $regex: searchQuery, $options: "i" }
  //   //   //   }
  //   //   // },
  //   //   {
  //   //     $project: {
  //   //       _id: 1,
  //   //       name: 1,
  //   //       parentCategoryId: 1
  //   //     }
  //   //   }
  //   // ])
  //   const categories = await this.categoryModel.findById(id).lean()
  //   const subcategories = await this.getCategoryTree(id)
  //   categories["subcategories"] = subcategories
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Category retrieved successfully',
  //     data: categories
  //   }
  // }
  // async getCategoryTree(parentId = null): Promise<any> {
  //   const categories = await this.categoryModel.find({ parentCategoryId: parentId }).sort({ _id: -1 }).select("-parentCategoryName -__v -createdAt -updatedAt").lean();

  //   for (let category of categories) {
  //     category["subcategories"] = await this.getCategoryTree(category._id); // Recursively fetch subcategories
  //   }

  //   return categories;
  // };

  async findOne(request: Request, id: string): Promise<any> {
    const categories = await this.categoryModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) } // Start with the given category
      },
      {
        $graphLookup: {
          from: "categories", // Collection name
          startWith: { $toString: "$_id" }, // Start with the given category ID
          connectFromField: "_id", // Parent ID reference
          connectToField: "parentCategoryId", // Match with child categories
          as: "subcategories", // Store hierarchy
          maxDepth: 4, // Ensures it fetches up to 4 levels deep
          depthField: "level" // Optional, tracks depth of each subcategory
        }
      },
      {
        $sort: { "subcategories.level": 1 } // Sort by level (optional)
      },
      {
        $project: {
          _id: 1,
          name: 1,
          parentCategoryId: 1,
          subcategories: {
            _id: 1,
            name: 1,
            parentCategoryId: 1
          }
        }
      }
    ]);

    return {
      status: HttpStatus.OK,
      message: 'Category retrieved successfully',
      data: categories[0] || null
    };
  }


  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
