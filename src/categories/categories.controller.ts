import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryPaginationDto, CreateCategoryDto } from './dto/create-category.dto';
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

  @UseGuards(JwtAdminAuthGuard)
  @Get("/admin")
  findForAdmin(
    @Req() request: Request,
    @Query() paginationDto: CategoryPaginationDto
  ) {
    return this.categoriesService.findForAdmin(request, paginationDto);
  }
  
  @UseGuards(JwtAdminAuthGuard)
  @Get("/:id/sub-category")
  findForSubCategoriesAdmin(
    @Req() request: Request,
    @Param("id") id: string,
    @Query() paginationDto: CategoryPaginationDto
  ) {
    return this.categoriesService.subCategories(request, id, paginationDto);
  }

  @Get('/find')
  findOne(@Req() request: Request, @Query('id') id: string) {
    return this.categoriesService.findOne(request, id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(request, id, updateCategoryDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id/status')
  changeStatus(@Req() request: Request, @Param('id') id: string) {
    return this.categoriesService.changeStatus(request, id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.categoriesService.remove(request, id);
  }
}
