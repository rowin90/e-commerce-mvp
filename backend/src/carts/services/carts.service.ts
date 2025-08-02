import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../../products/models/product.model';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    private productsService: ProductsService,
    private sequelize: Sequelize,
  ) {}

  // 获取用户购物车
  async getCart(userId: number) {
    let cart = await this.cartModel.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    // 如果购物车不存在，创建一个新的
    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        totalAmount: 0,
        totalQuantity: 0,
      });

      // 重新查询以获取完整的购物车信息
      cart = await this.cartModel.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            include: [Product],
          },
        ],
      });
    }

    return cart;
  }

  // 添加商品到购物车
  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const transaction = await this.sequelize.transaction();

    try {
      // 获取或创建购物车
      let cart = await this.cartModel.findOne({
        where: { userId },
        transaction,
      });

      if (!cart) {
        cart = await this.cartModel.create(
          {
            userId,
            totalAmount: 0,
            totalQuantity: 0,
          },
          { transaction },
        );
      }

      // 检查商品是否存在并且有足够库存
      const product = await this.productsService.findOne(addToCartDto.productId);

      if (product.stock < addToCartDto.quantity) {
        throw new BadRequestException(`商品 ${product.name} 库存不足`);
      }

      // 检查购物车中是否已有该商品
      let cartItem = await this.cartItemModel.findOne({
        where: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
        transaction,
      });

      if (cartItem) {
        // 如果已有该商品，更新数量和总价
        const newQuantity = cartItem.quantity + addToCartDto.quantity;
        
        if (product.stock < newQuantity) {
          throw new BadRequestException(`商品 ${product.name} 库存不足`);
        }
        
        await cartItem.update(
          {
            quantity: newQuantity,
            totalPrice: product.price * newQuantity,
          },
          { transaction },
        );
      } else {
        // 如果没有该商品，创建新的购物车项
        cartItem = await this.cartItemModel.create(
          {
            cartId: cart.id,
            productId: addToCartDto.productId,
            quantity: addToCartDto.quantity,
            price: product.price,
            totalPrice: product.price * addToCartDto.quantity,
          },
          { transaction },
        );
      }

      // 更新购物车总金额和总数量
      const cartItems = await this.cartItemModel.findAll({
        where: { cartId: cart.id },
        transaction,
      });

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      await cart.update(
        {
          totalAmount,
          totalQuantity,
        },
        { transaction },
      );

      await transaction.commit();

      return this.getCart(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 更新购物车项
  async updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto) {
    const transaction = await this.sequelize.transaction();

    try {
      // 获取购物车
      const cart = await this.cartModel.findOne({
        where: { userId },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException('购物车不存在');
      }

      // 获取购物车项
      const cartItem = await this.cartItemModel.findOne({
        where: {
          id: itemId,
          cartId: cart.id,
        },
        transaction,
      });

      if (!cartItem) {
        throw new NotFoundException('购物车项不存在');
      }

      // 检查商品是否有足够库存
      const product = await this.productsService.findOne(cartItem.productId);

      if (product.stock < updateCartItemDto.quantity) {
        throw new BadRequestException(`商品 ${product.name} 库存不足`);
      }

      // 更新购物车项
      await cartItem.update(
        {
          quantity: updateCartItemDto.quantity,
          totalPrice: product.price * updateCartItemDto.quantity,
        },
        { transaction },
      );

      // 更新购物车总金额和总数量
      const cartItems = await this.cartItemModel.findAll({
        where: { cartId: cart.id },
        transaction,
      });

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      await cart.update(
        {
          totalAmount,
          totalQuantity,
        },
        { transaction },
      );

      await transaction.commit();

      return this.getCart(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 从购物车中移除商品
  async removeFromCart(userId: number, itemId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // 获取购物车
      const cart = await this.cartModel.findOne({
        where: { userId },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException('购物车不存在');
      }

      // 获取购物车项
      const cartItem = await this.cartItemModel.findOne({
        where: {
          id: itemId,
          cartId: cart.id,
        },
        transaction,
      });

      if (!cartItem) {
        throw new NotFoundException('购物车项不存在');
      }

      // 删除购物车项
      await cartItem.destroy({ transaction });

      // 更新购物车总金额和总数量
      const cartItems = await this.cartItemModel.findAll({
        where: { cartId: cart.id },
        transaction,
      });

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      await cart.update(
        {
          totalAmount,
          totalQuantity,
        },
        { transaction },
      );

      await transaction.commit();

      return this.getCart(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 清空购物车
  async clearCart(userId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // 获取购物车
      const cart = await this.cartModel.findOne({
        where: { userId },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException('购物车不存在');
      }

      // 删除所有购物车项
      await this.cartItemModel.destroy({
        where: { cartId: cart.id },
        transaction,
      });

      // 更新购物车总金额和总数量
      await cart.update(
        {
          totalAmount: 0,
          totalQuantity: 0,
        },
        { transaction },
      );

      await transaction.commit();

      return this.getCart(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}