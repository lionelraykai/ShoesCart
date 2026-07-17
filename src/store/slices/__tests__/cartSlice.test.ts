import reducer, {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from '@/store/slices/cartSlice';

describe('cartSlice', () => {
  it('starts empty', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
  });

  it('adds a new line item for a shoe/size combination', () => {
    const state = reducer(
      { items: [] },
      addToCart({ shoeId: 'shoe_1', size: 9, quantity: 1 })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ shoeId: 'shoe_1', size: 9, quantity: 1 });
  });

  it('merges quantity when the same shoe/size is added again', () => {
    let state = reducer({ items: [] }, addToCart({ shoeId: 'shoe_1', size: 9, quantity: 1 }));
    state = reducer(state, addToCart({ shoeId: 'shoe_1', size: 9, quantity: 2 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('keeps separate line items for different sizes of the same shoe', () => {
    let state = reducer({ items: [] }, addToCart({ shoeId: 'shoe_1', size: 9, quantity: 1 }));
    state = reducer(state, addToCart({ shoeId: 'shoe_1', size: 10, quantity: 1 }));

    expect(state.items).toHaveLength(2);
  });

  it('removes a line item by id', () => {
    const state = reducer(
      { items: [{ id: 'cart_1', shoeId: 'shoe_1', size: 9, quantity: 1 }] },
      removeFromCart('cart_1')
    );

    expect(state.items).toEqual([]);
  });

  it('updates quantity but never below 1', () => {
    const initial = { items: [{ id: 'cart_1', shoeId: 'shoe_1', size: 9, quantity: 1 }] };

    const increased = reducer(initial, updateQuantity({ id: 'cart_1', quantity: 5 }));
    expect(increased.items[0].quantity).toBe(5);

    const clamped = reducer(initial, updateQuantity({ id: 'cart_1', quantity: 0 }));
    expect(clamped.items[0].quantity).toBe(1);
  });

  it('clears all items', () => {
    const initial = {
      items: [{ id: 'cart_1', shoeId: 'shoe_1', size: 9, quantity: 1 }],
    };
    const state = reducer(initial, clearCart());

    expect(state.items).toEqual([]);
  });
});
