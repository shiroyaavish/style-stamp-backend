import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, PaginationDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OptionalJwtAuthGuard } from 'src/auth/lib/optional-auth.strategy';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@Req() request: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(request, createOrderDto);
  }

  @Get()
  findAll(@Req() request: Request, @Body() paginationDto: PaginationDto) {
    return this.orderService.findAll(request, paginationDto);
  }

  @Post('/webhook')
  findOne(@Req() request: Request) {
    return this.orderService.findOne(request);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
