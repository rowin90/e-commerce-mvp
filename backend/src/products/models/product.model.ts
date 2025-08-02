import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { OrderItem } from '../../orders/models/order-item.model';
import { CartItem } from '../../carts/models/cart-item.model';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  category: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  // 关联关系
  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @HasMany(() => CartItem)
  cartItems: CartItem[];
}