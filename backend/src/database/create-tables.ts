import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Sequelize } from 'sequelize-typescript';

/**
 * 数据库建表脚本
 * 基于现有的 Sequelize 模型设计创建所有必要的表
 */
async function createTables() {
  console.log('🚀 开始创建数据库表...');
  
  try {
    // 创建 NestJS 应用实例
    const app = await NestFactory.createApplicationContext(AppModule);
    const sequelize = app.get(Sequelize);

    console.log('📊 连接到数据库...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步所有模型到数据库（创建表）
    console.log('🔨 正在创建数据库表...');
    await sequelize.sync({ force: false }); // force: false 表示不删除已存在的表
    
    console.log('✅ 数据库表创建完成！');
    console.log('');
    console.log('📋 已创建的表包括：');
    console.log('  - users (用户表)');
    console.log('  - products (商品表)');
    console.log('  - carts (购物车表)');
    console.log('  - cart_items (购物车项表)');
    console.log('  - orders (订单表)');
    console.log('  - order_items (订单项表)');
    console.log('');
    console.log('🎯 下一步：');
    console.log('  运行 npm run db:seed 来初始化示例数据');

    await app.close();
  } catch (error) {
    console.error('❌ 创建数据库表失败:', error);
    process.exit(1);
  }
}

/**
 * 强制重建所有表（危险操作，会删除所有数据）
 */
async function recreateTables() {
  console.log('⚠️  警告：即将删除并重建所有数据库表！');
  console.log('⚠️  这将删除所有现有数据！');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const sequelize = app.get(Sequelize);

    console.log('📊 连接到数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    console.log('🗑️  删除现有表...');
    await sequelize.drop();
    
    console.log('🔨 重新创建数据库表...');
    await sequelize.sync({ force: true });
    
    console.log('✅ 数据库表重建完成！');
    console.log('');
    console.log('🎯 下一步：');
    console.log('  运行 npm run db:seed 来初始化示例数据');

    await app.close();
  } catch (error) {
    console.error('❌ 重建数据库表失败:', error);
    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);
const forceRecreate = args.includes('--force') || args.includes('-f');

if (forceRecreate) {
  recreateTables();
} else {
  createTables();
}

// 导出函数供其他脚本使用
export { createTables, recreateTables };