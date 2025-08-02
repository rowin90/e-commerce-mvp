import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/services/products.service';
import { UsersService } from '../users/services/users.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productsService = app.get(ProductsService);
  const usersService = app.get(UsersService);

  try {
    // 检查是否已有产品数据
    const existingProducts = await productsService.findAll();
    if (existingProducts.length > 0) {
      console.log('数据库已有产品数据，跳过初始化');
      await app.close();
      return;
    }

    console.log('开始初始化数据库...');

    // 创建管理员用户
    try {
      await usersService.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('管理员用户创建成功');
    } catch (error) {
      console.log('管理员用户可能已存在');
    }

    // 创建普通用户
    try {
      await usersService.create({
        username: 'user1',
        email: 'user1@example.com',
        password: 'user123',
        role: 'user'
      });
      console.log('测试用户创建成功');
    } catch (error) {
      console.log('测试用户可能已存在');
    }

    // 创建初始产品数据
    const products = [
      {
        name: 'iPhone 14',
        description: '苹果最新款智能手机，配备A16仿生芯片，拍照效果出色',
        price: 6999.00,
        stock: 50,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
      },
      {
        name: 'MacBook Pro',
        description: '苹果专业级笔记本电脑，M2芯片，适合开发和设计工作',
        price: 12999.00,
        stock: 20,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
      },
      {
        name: 'AirPods Pro',
        description: '苹果无线降噪耳机，主动降噪技术，音质出色',
        price: 1999.00,
        stock: 100,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400'
      },
      {
        name: 'Nike Air Max',
        description: '舒适透气运动鞋，适合日常运动和休闲穿着',
        price: 599.00,
        stock: 80,
        category: '服装鞋帽',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
      },
      {
        name: 'Adidas运动T恤',
        description: '纯棉运动T恤，透气舒适，多种颜色可选',
        price: 199.00,
        stock: 150,
        category: '服装鞋帽',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
      },
      {
        name: '小米智能手环',
        description: '智能健康监测手环，支持心率监测、睡眠分析',
        price: 299.00,
        stock: 200,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400'
      },
      {
        name: '索尼无线耳机',
        description: '高品质无线耳机，降噪效果佳，续航时间长',
        price: 899.00,
        stock: 60,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      },
      {
        name: '联想ThinkPad',
        description: '商务笔记本电脑，稳定可靠，适合办公使用',
        price: 8999.00,
        stock: 30,
        category: '电子产品',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
      }
    ];

    for (const productData of products) {
      console.log(`正在创建产品: ${productData.name}, image: ${productData.image}`);
      const createdProduct = await productsService.create(productData);
      console.log(`产品 "${productData.name}" 创建成功, 保存的image: ${createdProduct.image}`);
    }

    console.log('数据库初始化完成！');
    console.log(`共创建了 ${products.length} 个产品`);
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    await app.close();
  }
}

seed();