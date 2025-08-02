import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ description: '电子邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '全名', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ description: '地址', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '电话号码', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '用户角色', enum: ['user', 'admin'], default: 'user', required: false })
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: string;
}