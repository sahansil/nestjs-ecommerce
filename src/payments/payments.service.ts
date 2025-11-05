import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId, user: { id: userId } } });
    if (!order) throw new NotFoundException('Order not found');
    const payment = this.paymentRepo.create({
      order,
      user: { id: userId },
      amount: dto.amount,
      status: 'pending',
    });
    return this.paymentRepo.save(payment);
  }

  async getPaymentsForUser(userId: string) {
    return this.paymentRepo.find({ where: { user: { id: userId } } });
  }
}