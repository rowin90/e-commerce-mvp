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
        email: 'admin@ecommerce.com',
        password: 'admin123',
        fullName: '系统管理员',
        address: '北京市朝阳区科技园区1号',
        phone: '13800138000',
        role: 'admin'
      });
      console.log('管理员用户创建成功');
    } catch (error) {
      console.log('管理员用户可能已存在');
    }

    // 创建普通用户
    try {
      await usersService.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        fullName: '测试用户',
        address: '上海市浦东新区张江高科技园区',
        phone: '13900139000',
        role: 'user'
      });
      console.log('测试用户创建成功');
    } catch (error) {
      console.log('测试用户可能已存在');
    }

    // 创建第二个普通用户
    try {
      await usersService.create({
        username: 'customer1',
        email: 'customer1@example.com',
        password: 'customer123',
        fullName: '张三',
        address: '广州市天河区珠江新城',
        phone: '13700137000',
        role: 'user'
      });
      console.log('客户用户创建成功');
    } catch (error) {
      console.log('客户用户可能已存在');
    }

    // 创建初始产品数据
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro，搭载A17 Pro芯片，钛金属设计，支持USB-C接口，拍照和视频功能全面升级',
        price: 8999.00,
        stock: 45,
        category: '智能手机',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        isActive: true
      },
      {
        name: 'MacBook Air M3',
        description: 'Apple MacBook Air 13英寸，M3芯片，8GB内存，256GB存储，轻薄便携，续航长达18小时',
        price: 9499.00,
        stock: 25,
        category: '笔记本电脑',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        isActive: true
      },
      {
        name: 'AirPods Pro 2',
        description: 'Apple AirPods Pro 第二代，主动降噪，空间音频，MagSafe充电盒，续航长达30小时',
        price: 1899.00,
        stock: 80,
        category: '音频设备',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
        isActive: true
      },
      {
        name: 'iPad Air 5',
        description: 'Apple iPad Air 第五代，M1芯片，10.9英寸液视网膜显示屏，支持Apple Pencil 2',
        price: 4399.00,
        stock: 35,
        category: '平板电脑',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        isActive: true
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Apple Watch Series 9，S9芯片，45mm表盘，GPS+蜂窝网络，健康监测功能全面',
        price: 3199.00,
        stock: 60,
        category: '智能穿戴',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
        isActive: true
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra，骁龙8 Gen 3芯片，200MP主摄，S Pen手写笔，6.8英寸屏幕',
        price: 9999.00,
        stock: 30,
        category: '智能手机',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        isActive: true
      },
      {
        name: 'Dell XPS 13',
        description: 'Dell XPS 13 笔记本电脑，Intel Core i7处理器，16GB内存，512GB SSD，13.4英寸4K显示屏',
        price: 11999.00,
        stock: 20,
        category: '笔记本电脑',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        isActive: true
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Sony WH-1000XM5 无线降噪耳机，业界领先的降噪技术，30小时续航，支持LDAC高音质',
        price: 2399.00,
        stock: 50,
        category: '音频设备',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        isActive: true
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Nintendo Switch OLED 游戏机，7英寸OLED屏幕，64GB存储，支持掌机和主机模式',
        price: 2599.00,
        stock: 40,
        category: '游戏设备',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        isActive: true
      },
      {
        name: 'Xiaomi 14 Pro',
        description: '小米14 Pro，骁龙8 Gen 3芯片，徕卡光学镜头，2K曲面屏，120W快充',
        price: 4999.00,
        stock: 55,
        category: '智能手机',
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
        isActive: true
      },
      {
        name: 'Dyson V15 Detect',
        description: 'Dyson V15 Detect 无绳吸尘器，激光显尘技术，60分钟续航，智能感应灰尘',
        price: 4690.00,
        stock: 25,
        category: '家用电器',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        isActive: true
      },
      {
        name: 'Kindle Oasis',
        description: 'Amazon Kindle Oasis 电子书阅读器，7英寸屏幕，IPX8防水，25LED背光，支持有声读物',
        price: 2399.00,
        stock: 35,
        category: '电子书阅读器',
        image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400',
        isActive: true
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