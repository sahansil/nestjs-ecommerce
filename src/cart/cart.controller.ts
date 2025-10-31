import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
// Update the path below if your jwt-auth.guard.ts is located elsewhere, e.g. '../../auth/jwt-auth.guard'
import { AuthGuard } from '../../src/users/auth/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post()
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch(':productId')
  updateItem(@Req() req, @Param('productId') productId: number, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(req.user.id, productId, dto);
  }

  @Delete(':productId')
  removeItem(@Req() req, @Param('productId') productId: number) {
    return this.cartService.removeCartItem(req.user.id, productId);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
