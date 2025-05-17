import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryPaginationDto, CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model, Types } from 'mongoose';
import { statusEnum } from 'src/constant/status';
import { CategoryResponse } from './interface/interface';
import { Product, ProductDocument } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(request: Request, createCategoryDto: CreateCategoryDto) {
    const { name, image, parentCategoryId, isActive } = createCategoryDto;

    const parentCategory = parentCategoryId ? await this.categoryModel.findById(parentCategoryId).lean() : null;

    const newCategory = await this.categoryModel.create({
      name,
      image,
      parentCategoryId,
      isActive: parentCategoryId ? parentCategory["isActive"] : isActive,
      path: []
    });

    newCategory.path = parentCategory
      ? [...parentCategory?.["path"], String(newCategory._id)]
      : [String(newCategory._id)];

    await newCategory.save();

    return {
      message: "Category created successfully",
      data: {
        _id: newCategory["_id"],
        name: newCategory["name"],
        image: newCategory["image"]
      }
    };
  }

  async findAll(request: Request) {
    const categories = await this.categoryModel.find({ parentCategoryId: null, status: statusEnum.Active }).sort({ name: 1 }).select("-parentCategoryId -parentCategoryName -__v -createdAt -updatedAt")
    return {
      status: HttpStatus.OK,
      message: 'Categories retrieved successfully',
      data: categories
    }
  }

  async findOne(request: Request, id: string): Promise<any> {
    const categories = await this.categoryModel.find({ path: { $in: [id] }, status: statusEnum.Active }).select("_id name parentCategoryId").lean();

    if (!categories || categories.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Category not found',
        data: null
      };
    }

    const updatedData = this.buildCategoryTree(categories);

    return {
      status: HttpStatus.OK,
      message: 'Category retrieved successfully',
      data: updatedData
    };
  }

  buildCategoryTree(categories: any[]): any {
    // Create a lookup map and initialize children arrays
    const map = {};
    categories.forEach(category => {
      // Ensure we always use strings for comparisons
      const id = category._id.toString();
      map[id] = { ...category, subcategories: [] };
    });

    const tree = [];

    categories.forEach(category => {
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

  async update(request: Request, id: string, updateCategoryDto: UpdateCategoryDto) {

    const parentCategory = updateCategoryDto["parentCategoryId"] && await this.categoryModel.findById(updateCategoryDto["parentCategoryId"]) || null;

    await this.categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: updateCategoryDto["name"],
          image: updateCategoryDto["image"],
          parentCategoryId: updateCategoryDto["parentCategoryId"],
          path: parentCategory && [...parentCategory?.["path"], id]
        }
      },
    )

    return {
      status: HttpStatus.OK,
      message: "Category updated successfully",
    }
  }

  //active or deactive the products is pending
  async changeStatus(request: Request, id: string) {
    const category = await this.categoryModel.findById(id)

    await this.categoryModel.updateMany({ path: { $in: [id] } }, {
      isActive: category.isActive ? false : true
    })

    await this.productModel.updateMany({ "category.id": id, isActive: category.isActive ? false : true })

    return {
      status: HttpStatus.OK,
      message: "Category status changed successfully"
    }
  }


  async remove(request: Request, id: string) {

    const categories = await this.categoryModel.find({ path: { $in: [id] } })
    await this.categoryModel.updateMany({ path: { $in: [id] } }, { isDelete: true });

    const categoryIds = categories.map((category) => String(category._id))

    await this.productModel.updateMany({ "category.id": { $in: categoryIds } }, { category: {}, isActive: false })

    await this.productModel.updateMany(
      { "subCategories.id": { $in: categoryIds } },
      {
        $pull: {
          subCategories: {
            id: { $in: categoryIds },
          },
        },
      }
    );

    return {
      status: HttpStatus.OK,
      message: "Category removed successfully",
    }
  }


  // for categories total sales and revenue is pending

  async findForAdmin(request: Request, paginationDto: CategoryPaginationDto): Promise<CategoryResponse> {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    const query = { parentCategoryId: null };

    if (paginationDto.search) {
      const searchRegex = paginationDto.search.replace(/\s+/g, "\\s+");
      query["name"] = new RegExp(`\\b${searchRegex}\\b`, "i");
    }

    const [categories, count] = await Promise.all([
      this.categoryModel
        .find(query)
        .select("-path -parentCategoryId -__v")
        .skip(skip)
        .limit(paginationDto.limit + 1)
        .lean(),
      this.categoryModel.countDocuments(query)
    ]);

    // Get all category IDs
    const categoryIds = categories.map(category => String(category._id));

    // Make a single query to get subcategory counts for all categories at once
    const subcategoryCounts = await this.categoryModel.aggregate([
      {
        $match: {
          path: { $in: categoryIds },
          _id: {
            $nin: categoryIds.map(id => new Types.ObjectId(id)),
          },
          isActive: true
        },
      },
      {
        $group: {
          _id: "$path",
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of category ID to subcategory count
    const countMap = subcategoryCounts.reduce((acc, item) => {
      // A subcategory might belong to multiple categories in its path
      // We need to count it for each parent category
      if (Array.isArray(item._id)) {
        item._id.forEach(pathId => {
          if (categoryIds.includes(String(pathId))) {
            acc[String(pathId)] = (acc[String(pathId)] || 0) + item.count;
          }
        });
      } else {
        acc[String(item._id)] = item.count;
      }
      return acc;
    }, {});

    // Map the results
    const data = categories.map(category => ({
      ...category,
      count: countMap[String(category._id)] || 0
    }));
    const isNextPageAvailable = data.length > paginationDto.limit
    if (isNextPageAvailable) data.pop()
    return {
      status: HttpStatus.OK,
      message: "Data Fetch Successfully",
      data,
      count,
      isNextPageAvailable
    };
  }

  async subCategories(request: Request, categoryId: string, paginationDto: CategoryPaginationDto): Promise<CategoryResponse> {

    const { page, limit, search } = paginationDto
    const query = { path: { $in: [categoryId] } }
    const skip = (page - 1) * limit

    if (paginationDto.search) {
      const searchRegex = paginationDto.search.replace(/\s+/g, "\\s+");
      query["name"] = new RegExp(`\\b${searchRegex}\\b`, "i");
    }

    const categories = await this.categoryModel
      .find(query)
      .select("-path -parentCategoryId -__v")
      .skip(skip)
      .limit(paginationDto.limit + 1)
      .lean()

    const count = await this.categoryModel.countDocuments(query);

    const isNextPageAvailable = categories.length > limit
    if (isNextPageAvailable) categories.pop()

    return {
      status: HttpStatus.OK,
      message: "Data Fetch Successfully",
      data: categories,
      count,
      isNextPageAvailable
    };
  }

}
