import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class OrderItemDto {
  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '商品数量' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '商品单价' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: '订单总金额' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ description: '订单状态', enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;

  @ApiProperty({ description: '收货地址' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ description: '支付方式' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ description: '是否已支付', default: false })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean = false;

  @ApiProperty({ description: '订单商品列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}