// ...existing code...
import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/users/decorators/auth.decoders';
import { CreateCartDto } from './dto/create-cart.dto';
import { CheckoutCartDto } from '../cart/dto/checkout-cart.dto';

@Controller('cart')
@UseGuards(Auth)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  // @Post()
  // async addToCart(@Req() req, @Body() dto: CreateCartDto) {
  //   return this.cartService.addToCart(req.user.id, dto);
  // }

  @Patch(':id')
  async updateItem(@Req() req, @Param('id') id: string, @Body() dto: CheckoutCartDto) {
    return this.cartService.updateQuantity(req.user.id, id, dto);
  }

  @Delete(':id')
  async removeItem(@Req() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
// ...existing code...