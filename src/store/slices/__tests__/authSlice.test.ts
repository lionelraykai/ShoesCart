import reducer, { logIn, logOut, signUp } from '@/store/slices/authSlice';
import { AuthUser } from '@/types';

const existingUser: AuthUser = {
  id: 'demo_user',
  name: 'Demo Shopper',
  email: 'user@shoecart.app',
  passwordHash: 'hash_user123',
  role: 'user',
};

describe('authSlice', () => {
  it('seeds a demo admin and demo user, logged out by default', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.currentUserId).toBeNull();
    expect(state.users.map((u) => u.role).sort()).toEqual(['admin', 'user']);
  });

  it('signs up a new account as a "user" role and logs them in', () => {
    const state = reducer(
      { users: [], currentUserId: null },
      signUp({ name: 'New Person', email: 'new@example.com', passwordHash: 'hash_abc' })
    );

    expect(state.users).toHaveLength(1);
    expect(state.users[0]).toMatchObject({
      name: 'New Person',
      email: 'new@example.com',
      passwordHash: 'hash_abc',
      role: 'user',
    });
    expect(state.users[0].id).toEqual(expect.any(String));
    expect(state.currentUserId).toBe(state.users[0].id);
  });

  it('logs in by setting currentUserId', () => {
    const state = reducer({ users: [existingUser], currentUserId: null }, logIn(existingUser.id));
    expect(state.currentUserId).toBe(existingUser.id);
  });

  it('logs out by clearing currentUserId', () => {
    const state = reducer({ users: [existingUser], currentUserId: existingUser.id }, logOut());
    expect(state.currentUserId).toBeNull();
  });
});
