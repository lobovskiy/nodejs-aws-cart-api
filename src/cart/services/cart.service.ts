import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from '../cart.entity';
import { CartItem } from '../cart-item.entity';
import { OrderService } from 'src/order';
import { Order } from 'src/order/order.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private orderService: OrderService,
    private dataSource: DataSource,
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

  async checkout(userId: string, orderData: object): Promise<Order> {
    const cart = await this.findByUserId(userId);

    if (!cart) {
      throw new Error('Cart does not exist.');
    }

    const newOrder = this.ordersRepository.create(orderData);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save<Order>(newOrder);
      await queryRunner.manager.update<Cart>(Cart, cart.id, {
        status: 'ORDERED',
      });

      await queryRunner.commitTransaction();

      return newOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartsRepository.delete({ user_id: userId });
  }
}
