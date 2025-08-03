# 数据库建表脚本说明

## 概述

本目录包含了电商系统的数据库建表脚本，基于现有的 Sequelize 模型设计。

## 文件说明

### 1. `create-tables.ts`
TypeScript 脚本，用于程序化创建数据库表。这是推荐的方式，因为它：
- 使用 Sequelize 的 `sync()` 方法自动创建表
- 支持不同的数据库类型（SQLite、MySQL）
- 包含完整的错误处理
- 自动处理外键关系和索引

### 2. `README-tables.md`
详细的使用说明文档，包含表结构说明、使用方法、外键关系等。

## 数据库表结构

系统包含以下6个主要表：

### 1. `users` - 用户表
- `id`: 主键，自增
- `username`: 用户名，唯一
- `email`: 邮箱，唯一
- `password`: 密码
- `fullName`: 全名
- `address`: 地址
- `phone`: 电话
- `role`: 角色 ('user' | 'admin')
- `createdAt`, `updatedAt`: 时间戳

### 2. `products` - 商品表
- `id`: 主键，自增
- `name`: 商品名称
- `price`: 价格 (DECIMAL 10,2)
- `description`: 描述
- `image`: 图片URL
- `category`: 分类
- `stock`: 库存
- `isActive`: 是否激活
- `createdAt`, `updatedAt`: 时间戳

### 3. `carts` - 购物车表
- `id`: 主键，自增
- `userId`: 用户ID，外键，唯一
- `totalAmount`: 总金额
- `totalQuantity`: 总数量
- `createdAt`, `updatedAt`: 时间戳

### 4. `cart_items` - 购物车项表
- `id`: 主键，自增
- `cartId`: 购物车ID，外键
- `productId`: 商品ID，外键
- `quantity`: 数量
- `price`: 单价
- `totalPrice`: 总价
- `createdAt`, `updatedAt`: 时间戳

### 5. `orders` - 订单表
- `id`: 主键，自增
- `userId`: 用户ID，外键
- `totalAmount`: 总金额
- `status`: 状态 ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')
- `shippingAddress`: 收货地址
- `paymentMethod`: 支付方式
- `isPaid`: 是否已支付
- `paidAt`: 支付时间
- `createdAt`, `updatedAt`: 时间戳

### 6. `order_items` - 订单项表
- `id`: 主键，自增
- `orderId`: 订单ID，外键
- `productId`: 商品ID，外键
- `quantity`: 数量
- `price`: 单价
- `totalPrice`: 总价
- `createdAt`, `updatedAt`: 时间戳

## 使用方法

### 方法一：使用 TypeScript 脚本（推荐）

```bash
# 创建数据库表（不删除现有数据）
npm run db:create

# 强制重建所有表（会删除所有数据）
npm run db:create:force
```

### 方法二：手动创建表

如果需要手动创建表，可以参考 TypeScript 脚本中的 Sequelize 模型定义，或者让 Sequelize 自动同步表结构。

## 外键关系

- `carts.userId` → `users.id`
- `cart_items.cartId` → `carts.id`
- `cart_items.productId` → `products.id`
- `orders.userId` → `users.id`
- `order_items.orderId` → `orders.id`
- `order_items.productId` → `products.id`

## 注意事项

1. **数据备份**: 在执行 `--force` 选项前，请确保备份重要数据
2. **环境配置**: 确保数据库连接配置正确
3. **权限**: 确保应用有足够的数据库权限创建表
4. **依赖**: 运行脚本前确保所有依赖已安装

## 下一步

创建表后，你可以：
1. 运行 `npm run seed` 初始化示例数据
2. 启动应用 `npm run dev`
3. 访问 API 文档查看可用接口

## 故障排除

如果遇到问题：
1. 检查数据库连接配置
2. 确认数据库服务正在运行
3. 查看控制台错误信息
4. 检查文件权限