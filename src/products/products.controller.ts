import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FindProductByCategoryDto, PaginationDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAdminAuthGuard } from 'src/auth/lib/admin-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  create(@Req() request: Request, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(request, createProductDto);
  }

  @Post("/admin")
  @UseGuards(JwtAdminAuthGuard)
  listingForAdmin(@Req() request: Request, @Body() paginationDto: PaginationDto) {
    return this.productsService.listingForAdmin(request, paginationDto);
  }

  @Get()
  findOne(@Req() request: Request, @Query("id") id: string) {
    return this.productsService.findOne(request, id);
  }

  @Post('category')
  findByCategory(@Req() request: Request, @Body() findProductByCategoryDto: FindProductByCategoryDto) {
    return this.productsService.findByCategory(request, findProductByCategoryDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(request, id, updateProductDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch('/:id/status')
  updateStatus(@Req() request: Request, @Param("id") id: string) {
    return this.productsService.updatedStatus(request, id);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.productsService.remove(request, id);
  }
}
