import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column('text')
  shippingAddress: string;

  @Column({
    type: 'enum',
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
  })
  paymentMethod: string;

  @CreateDateColumn()
  orderDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation with OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];
}
