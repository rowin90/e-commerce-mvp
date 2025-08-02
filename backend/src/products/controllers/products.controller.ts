import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新商品' })
  @ApiResponse({ status: 201, description: '商品创建成功' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有商品' })
  @ApiResponse({ status: 200, description: '返回所有商品列表' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定ID的商品' })
  @ApiResponse({ status: 200, description: '返回指定商品' })
  @ApiResponse({ status: 404, description: '商品未找到' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新指定ID的商品' })
  @ApiResponse({ status: 200, description: '商品更新成功' })
  @ApiResponse({ status: 404, description: '商品未找到' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除指定ID的商品' })
  @ApiResponse({ status: 200, description: '商品删除成功' })
  @ApiResponse({ status: 404, description: '商品未找到' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新商品库存' })
  @ApiResponse({ status: 200, description: '库存更新成功' })
  @ApiResponse({ status: 404, description: '商品未找到' })
  updateStock(@Param('id') id: string, @Body('stock') stock: number) {
    return this.productsService.updateStock(+id, stock);
  }
}