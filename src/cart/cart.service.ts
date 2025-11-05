import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.entity';
import {  CheckoutCartDto } from './dto/checkout-cart.dto';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  async getCart(userId: string) {
    return this.cartRepo.find({ where: { user: { id: userId } } });
  }

  // async addToCart(userId: string, dto: CreateCartDto) {
  //   const existing = await this.cartRepo.findOne({
  //     where: { user: { id: userId }, product: { id: dto.productId } },
  //   });
  //   if (existing) {
  //     existing.quantity += dto.quantity;
  //     return this.cartRepo.save(existing);
  //   }
  //   const item = this.cartRepo.create({
  //     user: { id: userId },
  //     product: { id: dto.productId },
  //     quantity: dto.quantity,
  //   } as any);
  //   return this.cartRepo.save(item);
  // }

  async updateQuantity(userId: string, cartItemId: string, dto: CheckoutCartDto) {
    const item = await this.cartRepo.findOne({
      where: { id: cartItemId, user: { id: userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = dto.quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(userId: string, cartItemId: string) {
    const item = await this.cartRepo.findOne({
      where: { id: cartItemId, user: { id: userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartRepo.remove(item);
    return { success: true };
  }

  async clearCart(userId: string) {
    const items = await this.cartRepo.find({ where: { user: { id: userId } } });
    if (items.length) await this.cartRepo.remove(items);
    return { success: true };
  }
}