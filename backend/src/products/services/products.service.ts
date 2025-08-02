import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  // 获取所有商品
  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  // 获取单个商品
  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // 创建商品
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      ...createProductDto,
    });
  }

  // 更新商品
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(updateProductDto);
    return product;
  }

  // 删除商品
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }

  // 更新商品库存
  async updateStock(id: number, newStock: number, transaction?: any): Promise<Product> {
    const product = await this.findOne(id);
    await product.update({ stock: newStock }, { transaction });
    return product;
  }
}