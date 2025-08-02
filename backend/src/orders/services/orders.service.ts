import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Product } from '../../products/models/product.model';
import { CreateOrderDto, OrderStatus } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
    private productsService: ProductsService,
    private sequelize: Sequelize,
  ) {}

  // 查找所有订单
  async findAll(userId?: number) {
    const where = userId ? { userId } : {};
    return this.orderModel.findAll({
      where,
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // 查找单个订单
  async findOne(id: number, userId?: number) {
    const where = { id };
    if (userId) {
      where['userId'] = userId;
    }

    const order = await this.orderModel.findOne({
      where,
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  // 创建订单
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const transaction = await this.sequelize.transaction();

    try {
      // 创建订单
      const order = await this.orderModel.create(
        {
          userId,
          totalAmount: createOrderDto.totalAmount,
          status: createOrderDto.status,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          isPaid: createOrderDto.isPaid,
          paidAt: createOrderDto.isPaid ? new Date() : null,
        },
        { transaction },
      );

      // 创建订单项
      const orderItems = [];
      for (const item of createOrderDto.orderItems) {
        // 检查商品是否存在并且有足够库存
        const product = await this.productsService.findOne(item.productId);
        
        if (product.stock < item.quantity) {
          throw new BadRequestException(`商品 ${product.name} 库存不足`);
        }

        // 减少商品库存
        await this.productsService.updateStock(
          item.productId,
          product.stock - item.quantity,
          transaction,
        );

        // 创建订单项
        const orderItem = await this.orderItemModel.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
          },
          { transaction },
        );

        orderItems.push(orderItem);
      }

      await transaction.commit();

      return this.findOne(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 更新订单
  async update(id: number, updateOrderDto: UpdateOrderDto, userId?: number) {
    const order = await this.findOne(id, userId);
    
    const transaction = await this.sequelize.transaction();
    
    try {
      // 更新订单基本信息
      await order.update(updateOrderDto, { transaction });
      
      // 如果订单已支付，更新支付时间
      if (updateOrderDto.isPaid && !order.isPaid) {
        await order.update({ paidAt: new Date() }, { transaction });
      }
      
      await transaction.commit();
      
      return this.findOne(id, userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 更新订单状态
  async updateStatus(id: number, status: OrderStatus, userId?: number) {
    const order = await this.findOne(id, userId);
    
    await order.update({ status });
    
    return this.findOne(id, userId);
  }

  // 取消订单
  async cancelOrder(id: number, userId?: number) {
    const order = await this.findOne(id, userId);
    
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只有待处理的订单可以取消');
    }
    
    const transaction = await this.sequelize.transaction();
    
    try {
      // 更新订单状态为已取消
      await order.update(
        { status: OrderStatus.CANCELLED },
        { transaction },
      );
      
      // 恢复商品库存
      const orderItems = await this.orderItemModel.findAll({
        where: { orderId: id },
        include: [Product],
        transaction,
      });
      
      for (const item of orderItems) {
        await this.productsService.updateStock(
          item.productId,
          item.product.stock + item.quantity,
          transaction,
        );
      }
      
      await transaction.commit();
      
      return this.findOne(id, userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 删除订单
  async remove(id: number, userId?: number) {
    const order = await this.findOne(id, userId);
    
    if (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('只有已取消或已送达的订单可以删除');
    }
    
    const transaction = await this.sequelize.transaction();
    
    try {
      // 删除订单项
      await this.orderItemModel.destroy({
        where: { orderId: id },
        transaction,
      });
      
      // 删除订单
      await order.destroy({ transaction });
      
      await transaction.commit();
      
      return { message: '订单删除成功' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}