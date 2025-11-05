import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
// import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createOrderFromCart(userId: string) {
    // Implement logic to create order from user's cart
  }

  async getOrdersForUser(userId: string) {
    return this.orderRepo.find({ where: { user: { id: userId } } });
  }

  async getOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user: { id: userId } } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(orderId: string, status: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }
}