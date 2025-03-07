import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAdminAuthGuard } from 'src/auth/lib/admin-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Category")
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(JwtAdminAuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoriesService.create(request, createCategoryDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.categoriesService.findAll(request);
  }

  @Get('/find')
  findOne(@Req() request: Request, @Query('id') id: string) {
    return this.categoriesService.findOne(request, id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(request,id, updateCategoryDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Delete(':id')
  remove(@Req() request:Request,@Param('id') id: string) {
    return this.categoriesService.remove(request,id);
  }
}
