import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from '../cart.entity';
import { CartItem } from '../cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    return await this.cartsRepository.findOne({
      relations: {
        items: true,
      },
      where: { user_id: userId, status: 'OPEN' },
    });
  }

  async createByUserId(userId: string) {
    return await this.cartsRepository.save({
      user_id: userId,
      items: [],
    });
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { product, count }): Promise<Cart> {
    const { id } = await this.findOrCreateByUserId(userId);

    const cartItem = await this.cartItemsRepository.findOne({
      where: { cart_id: id, product_id: product.id },
    });

    if (cartItem) {
      if (count === 0) {
        await this.cartItemsRepository.delete(cartItem.id);

        return await this.cartsRepository.findOne({
          relations: {
            items: true,
          },
          where: { id },
        });
      }

      await this.cartItemsRepository.update(cartItem.id, { count });

      return await this.cartsRepository.findOne({
        relations: {
          items: true,
        },
        where: { id },
      });
    }

    await this.cartItemsRepository.save({
      cart_id: id,
      product_id: product.id,
      price: product.price,
      count: count,
    });

    return await this.cartsRepository.findOne({
      relations: {
        items: true,
      },
      where: { id },
    });
  }

  async setCartStatus(userId: string, status: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);

    if (!cart) {
      throw new Error('Cart does not exist.');
    }

    await this.cartsRepository.update(cart.id, { status });

    return { ...cart, status };
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartsRepository.delete({ user_id: userId });
  }
}
