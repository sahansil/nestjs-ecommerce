import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) { }

  // Get all orders (with optional filters)
  async getAllOrders(filters?: any): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: filters,
        relations: ['orderItems'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Get single order
  async getOneOrder(id: string): Promise<Order | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Create new order
  async addOrder(createOrderDto: CreateOrderDto): Promise<Order | null> {
    const totalAmount = createOrderDto.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    try {
      const createdOrder = await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          const order = this.orderRepository.create({
            ...createOrderDto,
            totalAmount: totalAmount,
          });

          const createdOrder = await this.orderRepository.save(order);

          const orderItems = createOrderDto.orderItems.map((item) =>
            this.orderItemRepository.create({
              ...item,
              product: { id: item.productId },
              order: createdOrder,
            }),
          );

          await transactionalEntityManager.save(orderItems);

          const fullOrder = await this.orderRepository.findOne({
            where: { id: createdOrder.id },
            relations: ['orderItems'],
          });

          return fullOrder;
        },
      );


      //   // // create order entity
      //   // const order = this.orderRepository.create({
      //   //   ...createOrderDto,
      //   //   totalAmount: total,
      //   // });

      //   // save order
      //  

      //   // save items
      //   
      //   );
      //   await this.orderItemRepository.save(orderItems);

      //   return this.getOneOrder(savedOrder.id);

      return createdOrder;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Update order status
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      if (updateOrderDto.status) {
        existingOrder.status = updateOrderDto.status;
      }

      if (updateOrderDto.deliveryDate) {
        existingOrder.deliveryDate = updateOrderDto.deliveryDate;
      }

      return await this.orderRepository.save(existingOrder);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Delete / Cancel order
  async deleteOrder(id: string): Promise<string> {
    try {
      const existingOrder = await this.orderRepository.findOneBy({ id });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      await this.orderRepository.remove(existingOrder);
      return 'Order deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}


