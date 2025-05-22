import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/products/entities/product.entity';
import { Model } from 'mongoose';
import { Cart, CartDocumnet } from './entities/cart.entity';
import { StatusEnum } from 'src/constant/status';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Product.name) private procductModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocumnet>
  ) { }
  async create(request: Request, createCartDto: CreateCartDto) {
    const user = request?.["user"];

    const { productId, isCustomizable, customizedImage, mockupImage, originalImage, attributes } = createCartDto;

    const product = await this.procductModel.findById(productId)

    if (isCustomizable && (!customizedImage || !mockupImage || !originalImage)) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: "Please Add the customized image before the add to cart",
        data: {}
      }, HttpStatus.BAD_REQUEST)
    }

    if (product.isCustomizable != isCustomizable) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: "Product details is wrong.",
        data: {}
      }, HttpStatus.BAD_REQUEST)
    }

    if (product && product["status"] !== StatusEnum.Active) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: "Product is not available for now.",
        data: {}
      }, HttpStatus.BAD_REQUEST)
    }

    const cartDetails = {
      productId: productId,
      attributes: attributes,
      title: product["title"],
      category: product["category"],
      description: product["description"],
      quantity: 1,
      price: product["price"],
      salePrice: product["salePrice"],
      totalAmount: product["salePrice"],
      images: product["images"],
      isCustomizable: isCustomizable,
      mockupImage: mockupImage,
      originalImage: originalImage,
      customizedImage: customizedImage,
      status: product["status"],
      userId: user?.["id"]
    }

    const cart = await this.cartModel.create(cartDetails)

    return {
      status: HttpStatus.CREATED,
      message: "Item Added to cart.",
      data: cart
    }

  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cartItem = await this.cartModel.findById(id);

    if (!cartItem) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: "Cart item not found.",
        data: {}
      }, HttpStatus.NOT_FOUND)
    }

    await this.cartModel.findByIdAndUpdate(id, { quantity: updateCartDto.quantity, totalAmount: cartItem.salePrice * updateCartDto.quantity })

    return {
      status: HttpStatus.OK,
      message: "Cart item updated successful."
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
