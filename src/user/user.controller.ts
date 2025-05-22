import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAdminAuthGuard } from 'src/auth/lib/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/lib/optional-auth.strategy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@Req() request: Request, @Body() createUserDto: CreateUserDto) {
    console.log(request["user"]);

    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get("/admin")
  findAll(@Req() request: Request, @Body() paginzationDto: PaginationDto) {
    return this.userService.findAll(request, paginzationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch("/bloack")
  blockUser(@Req() request: Request, @Query("id") id: string){
    return this.userService.blockUser(request,id)
  }
}
