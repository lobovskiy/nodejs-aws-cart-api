import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { User } from './users/users.entity';
import { CartItem } from './cart/cart-item.entity';
import { Cart } from './cart/cart.entity';
import { Order } from './order/order.entity';

export const JWT_CONFIG = {
  secret: 'secret',
  expiresIn: '12h',
};

export const postgresConnection: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: +process.env.DB_PORT ?? 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  entities: [User, CartItem, Cart, Order],
};
