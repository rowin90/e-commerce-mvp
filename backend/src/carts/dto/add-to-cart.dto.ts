import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '商品数量', minimum: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}