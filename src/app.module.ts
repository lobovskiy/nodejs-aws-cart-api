import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { postgresConnection } from './constants';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot(postgresConnection),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
