import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([CartItem, Cart])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
