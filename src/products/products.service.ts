import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, FindProductByCategoryDto, PaginationDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model } from 'mongoose';
import { generateUniqueIdSlug } from 'src/utils/uniqueCode.utils';
import { GenerateSlug } from 'src/utils/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  async create(request: Request, createProductDto: CreateProductDto) {

    if (createProductDto["isCustomizable"] && !createProductDto["mockupImage"]) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: "If the Product is customizable so then add mockupImage"
      },
        HttpStatus.BAD_REQUEST
      )
    }

    const productData = {
      title: createProductDto["title"].trim(),
      slug: GenerateSlug(createProductDto["title"]),
      description: createProductDto["description"],
      details: createProductDto["details"],
      category: createProductDto["category"],
      subCategories: createProductDto["subCategories"],
      price: createProductDto["price"],
      salePrice: createProductDto["salePrice"],
      attributes: createProductDto["attributes"],
      highlights: createProductDto["highlights"],
      features: createProductDto["features"],
      isFeatured: createProductDto["isFeatured"],
      scheduledDae: createProductDto["scheduledDae"],
      images: createProductDto["images"],
      isCustomizable: createProductDto["isCustomizable"],
      mockupImage: createProductDto["mockupImage"],
      isActive: createProductDto["isActive"],
    };
    await this.productModel.create(productData);
    return {
      status: HttpStatus.CREATED,
      message: "Product Added Successfully"
    }
  }

  async listingForAdmin(request: Request, paginationDto: PaginationDto) {
    const { categoryId, page, limit, sortColumn, sortOrder } = paginationDto

    const skip = (page - 1) * limit

    let filter = {}
    if (categoryId) {
      filter = { ...filter, $or: [{ "category.id": { $in: categoryId } }, { "subCategories.id": { $in: categoryId } }] }
    }
    let sort: Record<string, any> = {
      [sortColumn ?? "_id"]: (sortOrder ?? -1)
    }

    const products = await this.productModel.aggregate([
      {
        $match: filter
      },
      {
        $sort: sort
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          isActive: 1,
          isDelete: 1,
          images: 1,
          salePrice: 1
        }
      }
    ])

    const count = await this.productModel.countDocuments(filter);

    return {
      status: HttpStatus.OK,
      message: "Data Found Successfully",
      data: products,
      count
    }
  }

  async findOne(request, id) {
    const item = await this.productModel.findById(id).select("-__v -createdAt -updatedAt")

    return {
      status: HttpStatus.OK,
      message: "Data Found Successfully",
      data: item
    }
  }

  async findByCategory(request: Request, findProductByCategoryDto: FindProductByCategoryDto) {
    
    const { categoryId, material, maxPrice, minPrice, limit = 10, page = 1, priceLowToHigh, colors } = findProductByCategoryDto
    const filter: any = { categoryId: categoryId };

    if (minPrice || maxPrice) {
      filter.$or = [
        { "price": { $gte: Number(minPrice) } },
        { "price": { $lte: Number(maxPrice) } }
      ];
    }

    if (colors && colors.length > 0) {
      filter.colors = { $in: colors };
    }
    if (material && material.length > 0) {
      filter.material = { $in: material };
    }

    const sort: any = {};
    if (priceLowToHigh) {
      sort["price"] = Number(priceLowToHigh);
    }


    const skip = (Number(page) - 1) * Number(limit);
    const pipeline = [
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: Number(limit) + 1 }
    ];

    const products = await this.productModel.aggregate(pipeline)
    const isNextPageAvailable = products.length > Number(limit);
    if (isNextPageAvailable) {
      products.pop()
    }
    const total = await this.productModel.countDocuments(filter);

    return {
      status: HttpStatus.OK,
      message: "Data Found Successfully",
      data: {
        products: products,
        total,
        isNextPageAvailable
      }
    };

  }

  async update(request: Request, id: string, updateProductDto: UpdateProductDto) {
    const { deletedImages, ...updatedData } = updateProductDto
    if (updatedData.isCustomizable && !updatedData.mockupImage) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: "If the Product is customizable so then add mockupImage"
      },
        HttpStatus.BAD_REQUEST
      )
    }
    const product = await this.productModel.findById(id).select("name");
    const productData = {
      description: updatedData["description"],
      details: updatedData["details"],
      category: updatedData["category"],
      subCategories: updatedData["subCategories"],
      price: updatedData["price"],
      salePrice: updatedData["salePrice"],
      attributes: updatedData["attributes"],
      highlights: updatedData["highlights"],
      features: updatedData["features"],
      isFeatured: updatedData["isFeatured"],
      scheduleDate: updatedData["scheduleDate"],
      images: updatedData["images"],
      isCustomizable: updatedData["isCustomizable"],
      mockupImage: updatedData["mockupImage"],
      isActive: updatedData["isActive"],
    }

    const isTitleSame = product["title"] == updatedData["title"]
    if (!isTitleSame) {
      productData["slug"] = !isTitleSame && GenerateSlug(updatedData["title"])
      productData['title'] = updatedData["title"]
    }
    await this.productModel.findByIdAndUpdate(id, {
      $set: productData
    })

    return {
      status: HttpStatus.OK,
      message: "Data Updated Successfully"
    }
  }

  async updatedStatus(request: Request, id: string) {
    const product = await this.productModel.findById(id)

    await this.productModel.findByIdAndUpdate(id, { $set: { isActive: !product.isActive } })

    return {
      status: HttpStatus.OK,
      message: "Data Updated Successfully"
    }
  }

  async remove(request: Request, id: string) {
    await this.productModel.findByIdAndUpdate(id, { $set: { isDelete: true, isActive: false } })

    return {
      status: HttpStatus.OK,
      message: "Data Updated Successfully"
    }
  }
}
