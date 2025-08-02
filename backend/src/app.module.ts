/*
 * @Author: 饶驹 raoju1580@qq.com
 * @Date: 2025-07-31 17:17:46
 * @LastEditors: 饶驹 raoju1580@qq.com
 * @LastEditTime: 2025-08-02 15:21:29
 * @FilePath: /e-m/e-commerce-mvp/backend/src/app.module.ts

 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 配置模块，加载.env文件
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 数据库连接配置
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbDialect = configService.get('DB_DIALECT', 'sqlite');

        if (dbDialect === 'sqlite') {
          return {
            dialect: 'sqlite',
            storage: configService.get('DB_STORAGE', './database.sqlite'),
            autoLoadModels: true,
            synchronize: true,
            logging: false,
          };
        }

        // MySQL配置（保留原有配置）
        return {
          dialect: 'mysql',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password: configService.get('DB_PASSWORD', 'password'),
          database: configService.get('DB_DATABASE', 'ecommerce_db'),
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
    // 功能模块
    ProductsModule,
    UsersModule,
    OrdersModule,
    CartsModule,
    AuthModule,
  ],
})
export class AppModule {}