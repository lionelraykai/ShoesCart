import reducer, { placeOrder } from '@/store/slices/ordersSlice';
import { OrderItem } from '@/types';

describe('ordersSlice', () => {
  it('starts empty', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
  });

  it('places an order, computing the total from line items and tagging the placing user', () => {
    const items: OrderItem[] = [
      { shoeId: 'shoe_1', brand: 'Nike', name: 'Air Runner 90', price: 100, size: 9, quantity: 2 },
      { shoeId: 'shoe_2', brand: 'Vans', name: 'Old Skool', price: 50, size: 10, quantity: 1 },
    ];

    const state = reducer({ items: [] }, placeOrder({ userId: 'user_1', items }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].total).toBe(250);
    expect(state.items[0].items).toEqual(items);
    expect(state.items[0].userId).toBe('user_1');
    expect(state.items[0].id).toEqual(expect.any(String));
    expect(state.items[0].placedAt).toEqual(expect.any(Number));
  });

  it('prepends new orders so the most recent order is first', () => {
    const first: OrderItem[] = [
      { shoeId: 'shoe_1', brand: 'Nike', name: 'Air Runner 90', price: 100, size: 9, quantity: 1 },
    ];
    const second: OrderItem[] = [
      { shoeId: 'shoe_2', brand: 'Vans', name: 'Old Skool', price: 50, size: 10, quantity: 1 },
    ];

    let state = reducer({ items: [] }, placeOrder({ userId: 'user_1', items: first }));
    state = reducer(state, placeOrder({ userId: 'user_1', items: second }));

    expect(state.items).toHaveLength(2);
    expect(state.items[0].items).toEqual(second);
    expect(state.items[1].items).toEqual(first);
  });
});
