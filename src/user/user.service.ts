import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(request: Request, paginationDto: PaginationDto): Promise<any> {
    const { page, limit, sortColumn, search, sortOrder } = paginationDto
    let filter = {}
    if (search) {
      const regex = new RegExp(`//b${search}b//`, "i");
      filter["$or"] = [
        { name: regex },
        { mobileNumber: regex },
        { email: regex }
      ]
    }
    const sort: any = {
      [sortColumn ?? "_id"]: (sortOrder ?? -1)
    }

    const users = await this.userModel.find(filter).select("_id name mobilenumber email").sort(sort).skip((page - 1) * limit).limit(limit).lean()

    const count = await this.userModel.countDocuments(filter)

    return {
      status: HttpStatus.OK,
      message: "Data Fetched Successfully",
      data: users,
      count
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async blockUser(request: Request, id: string) {
    
    const findUser = await this.userModel.findById(id);

    await this.userModel.findByIdAndUpdate(id, { isBlocked: findUser.isBlocked });

    return {
      status: HttpStatus.OK,
      message: `user ${findUser.isBlocked ? "unblocked" : "blocked"} Successfully`,
    }
  }
}
