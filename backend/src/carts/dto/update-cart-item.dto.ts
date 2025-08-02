import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: '商品数量', minimum: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}