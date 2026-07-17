import reducer, { addShoe, deleteShoe, updateShoe } from '@/store/slices/shoesSlice';
import { seedShoes } from '@/store/seedShoes';
import { Shoe } from '@/types';

describe('shoesSlice', () => {
  it('seeds initial state with sample shoes', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual(seedShoes);
  });

  it('adds a new shoe with a generated id and createdAt', () => {
    const state = reducer(
      { items: [] },
      addShoe({ brand: 'Puma', name: 'RS-X', price: 99.99, sizes: [8, 9, 10] })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ brand: 'Puma', name: 'RS-X', price: 99.99 });
    expect(state.items[0].id).toEqual(expect.any(String));
    expect(state.items[0].createdAt).toEqual(expect.any(Number));
  });

  it('updates an existing shoe in place', () => {
    const existing: Shoe = {
      id: 'shoe_1',
      brand: 'Puma',
      name: 'RS-X',
      price: 99.99,
      sizes: [8, 9],
      createdAt: 1,
    };
    const state = reducer(
      { items: [existing] },
      updateShoe({ ...existing, price: 79.99, sizes: [8, 9, 10] })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].price).toBe(79.99);
    expect(state.items[0].sizes).toEqual([8, 9, 10]);
  });

  it('leaves state unchanged when updating a shoe id that does not exist', () => {
    const existing: Shoe = {
      id: 'shoe_1',
      brand: 'Puma',
      name: 'RS-X',
      price: 99.99,
      sizes: [8, 9],
      createdAt: 1,
    };
    const state = reducer({ items: [existing] }, updateShoe({ ...existing, id: 'missing' }));

    expect(state.items).toEqual([existing]);
  });

  it('deletes a shoe by id', () => {
    const shoeA: Shoe = { id: 'a', brand: 'A', name: 'A', price: 1, sizes: [8], createdAt: 1 };
    const shoeB: Shoe = { id: 'b', brand: 'B', name: 'B', price: 2, sizes: [9], createdAt: 2 };
    const state = reducer({ items: [shoeA, shoeB] }, deleteShoe('a'));

    expect(state.items).toEqual([shoeB]);
  });
});
