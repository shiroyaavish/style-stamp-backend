import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'postfinancecheckout/build/src/models/User';
import { Attribute, AttributeSchema } from 'src/attributes/entities/attribute.entity';
import { Cart, CartSchema } from 'src/carts/entities/cart.entity';
import { Category, CategorySchema } from 'src/categories/entities/category.entity';
import { Inquiry, InquirySchema } from 'src/inquiries/entities/inquiry.entity';
import { Order, OrderSchema } from 'src/order/entities/order.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { Admin, AdminSchema } from 'src/user/entities/admin.entity';
import { AuthInfo, authInfoSchema } from 'src/user/entities/authInfo.entity';
import { UserSchema } from 'src/user/entities/user.entity';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Attribute.name, schema: AttributeSchema },
            { name: AuthInfo.name, schema: authInfoSchema },
            { name: Cart.name, schema: CartSchema },
            { name: Category.name, schema: CategorySchema },
            { name: Inquiry.name, schema: InquirySchema },
            { name: Order.name, schema: OrderSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Admin.name, schema: AdminSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
