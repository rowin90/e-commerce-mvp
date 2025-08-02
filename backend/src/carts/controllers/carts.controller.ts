import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartsService } from '../services/carts.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('购物车')
@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('my-cart')
  @ApiOperation({ summary: '获取当前用户的购物车' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  getCart(@Request() req) {
    return this.cartsService.getCart(req.user.id);
  }

  @Post('add-to-cart')
  @ApiOperation({ summary: '添加商品到购物车' })
  @ApiResponse({ status: 201, description: '添加成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(req.user.id, addToCartDto);
  }

  @Patch('cart-items/:id')
  @ApiOperation({ summary: '更新购物车项' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '购物车项不存在' })
  updateCartItem(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(req.user.id, id, updateCartItemDto);
  }

  @Delete('cart-items/:id')
  @ApiOperation({ summary: '从购物车中移除商品' })
  @ApiResponse({ status: 200, description: '移除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '购物车项不存在' })
  removeFromCart(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartsService.removeFromCart(req.user.id, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: '清空购物车' })
  @ApiResponse({ status: 200, description: '清空成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  clearCart(@Request() req) {
    return this.cartsService.clearCart(req.user.id);
  }
}