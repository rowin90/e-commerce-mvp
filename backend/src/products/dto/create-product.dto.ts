import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: '产品名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '产品价格' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '产品描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '产品图片URL', required: false })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: '产品库存数量' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: '产品是否激活', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}