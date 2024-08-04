import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Order } from '../order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: {
        cart: { items: true },
      },
    });
  }

  async create(userId: string, data: any): Promise<Order> {
    return await this.ordersRepository.save({
      user_id: userId,
      cart_id: data.cart_id,
      delivery: data.address,
      total: data.total,
    });
  }

  async findById(orderId: string): Promise<Order> {
    return this.ordersRepository.findOne({
      relations: {
        cart: { items: true },
      },
      where: { id: orderId },
    });
  }

  async delete(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    await this.ordersRepository.delete(orderId);

    return order;
  }

  async update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const newOrder = { ...order, ...data };

    await this.ordersRepository.update(orderId, newOrder);

    return newOrder;
  }
}
