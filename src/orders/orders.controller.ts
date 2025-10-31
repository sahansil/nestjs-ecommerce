import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /orders
  @Get()
   getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // GET /orders/:id
  @Get(':id')
  async getOneOrder(@Param('id') id: string) {
    return this.ordersService.getOneOrder(id);
  }

  // POST /orders
  @Post()
  async addOrder(@Body() createOrderDto: CreateOrderDto){
    return this.ordersService.addOrder(createOrderDto);
  }

  // PATCH /orders/:id
  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  // DELETE /orders/:id
  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<{ message: string }> {
    await this.ordersService.deleteOrder(id);
    return { message: 'Order deleted successfully' };
  }
}
