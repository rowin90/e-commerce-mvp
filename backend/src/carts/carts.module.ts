import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartsController } from './controllers/carts.controller';
import { CartsService } from './services/carts.service';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart, CartItem]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}