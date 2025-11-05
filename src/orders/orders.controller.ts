import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from 'src/users/decorators/auth.decoders';
import { Roles } from 'src/users/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RolesGuard } from 'src/users/auth/guards/roles.guard';

@Controller('orders')
@UseGuards(Auth)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async createFromCart(@Req() req) {
    return this.ordersService.createOrderFromCart(req.user.id);
  }

  @Get()
  async getOrders(@Req() req) {
    return this.ordersService.getOrdersForUser(req.user.id);
  }

  @Get(':id')
  async getOrder(@Req() req, @Param('id') id: string) {
    return this.ordersService.getOrder(id, req.user.id);
  }

  @Patch(':id/status')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}