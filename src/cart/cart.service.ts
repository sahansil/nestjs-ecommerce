import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async getUserCart(userId: number) {
    return this.cartRepo.find({ where: { user: { id: userId } }, relations: ['product'] });
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) throw new NotFoundException('Product not found');

    let item = await this.cartRepo.findOne({
      where: { user: { id: userId }, product: { id: dto.productId } },
    });

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.cartRepo.create({ user: { id: userId }, product, quantity: dto.quantity });
    }

    return this.cartRepo.save(item);
  }

  async updateCartItem(userId: number, productId: number, dto: UpdateCartItemDto) {
    const item = await this.cartRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = dto.quantity;
    return this.cartRepo.save(item);
  }

  async removeCartItem(userId: number, productId: number) {
    await this.cartRepo.delete({ user: { id: userId }, product: { id: productId } });
    return { message: 'Item removed' };
  }

  async clearCart(userId: number) {
    await this.cartRepo.delete({ user: { id: userId } });
    return { message: 'Cart cleared' };
  }
}
