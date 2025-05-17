import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAttributeDto, PaginationDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Model } from 'mongoose';
import { Attribute, AttributeDocument } from './entities/attribute.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<AttributeDocument>
  ) { }
  async create(request: Request, createAttributeDto: CreateAttributeDto) {
    const attribute = {
      name: createAttributeDto.name,
      description: createAttributeDto.description,
      attributes: createAttributeDto.attributes,
    }
    await this.attributeModel.create(attribute);
    return {
      status: HttpStatus.CREATED,
      message: "Attribute created successfully",
      data: {},
    }
  }

  async findAll(request: Request, paginationDto: PaginationDto) {
    const search = new RegExp(paginationDto.search, "i")
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    const limit = paginationDto.limit;
    const attributes = await this.attributeModel.find({ name: search }).skip(skip).limit(limit);
    const count = await this.attributeModel.countDocuments({});
    return {
      status: HttpStatus.FOUND,
      message: "Attributes fetched successfully",
      data: attributes,
      count
    }
  }

  async findOne(request: Request, id: string) {
    const attribute = await this.attributeModel.findById(id)
    return {
      status: HttpStatus.FOUND,
      message: "Attribute fetched successfully",
      data: attribute
    }
  }

  async update(request: Request, id: string, updateAttributeDto: UpdateAttributeDto) {
    const attribute = await this.attributeModel.findById(id)
    if (!attribute) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: "Attribute not found !!"
      }, HttpStatus.NOT_FOUND)
    }
    const attributeDetail = {
      name: updateAttributeDto.name,
      description: updateAttributeDto.description,
      attributes: updateAttributeDto.attributes
    }
    const updatedAttr = await this.attributeModel.findByIdAndUpdate(id, attributeDetail, { new: true });
    return {
      status: HttpStatus.OK,
      message: "Attribute Updated successfully.",
      data: updatedAttr
    }
  }

  async remove(request: Request, id: string) {
    await this.attributeModel.findByIdAndUpdate(id,{isDelete:true});
    return {
      status: HttpStatus.OK,
      message: "Attribute Removed successfully.",
    }
  }
}
