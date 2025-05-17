import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto, PaginationDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { JwtAdminAuthGuard } from 'src/auth/lib/admin-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('attributes')
@ApiTags("Attributes")
@UseGuards(JwtAdminAuthGuard)
export class AttributesController {
  constructor(
    private readonly attributesService: AttributesService,
  ) { }

  @Post()
  create(
    @Req() req: Request,
    @Body() createAttributeDto: CreateAttributeDto
  ) {
    return this.attributesService.create(req, createAttributeDto);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query() paginationDto: PaginationDto
  ) {
    return this.attributesService.findAll(req, paginationDto);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.attributesService.findOne(req, id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(req, id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.attributesService.remove(req, id);
  }
}
