import { CartItem } from '../cart-item.entity';
import { Cart } from '../cart.entity';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart ? cart.items.reduce((acc: number, { price, count }: CartItem) => {
    return acc += price * count;
  }, 0) : 0;
}
