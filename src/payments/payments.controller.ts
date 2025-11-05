import { Controller, Post, Get, Req, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Auth } from 'src/users/decorators/auth.decoders';

@Controller('payments')
@UseGuards(Auth)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Req() req, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user.id, dto);
  }

  @Get()
  async getPayments(@Req() req) {
    return this.paymentsService.getPaymentsForUser(req.user.id);
  }
}