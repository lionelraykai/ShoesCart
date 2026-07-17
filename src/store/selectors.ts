import type { RootState } from '@/store';

export function selectCurrentUser(state: RootState) {
  return state.auth.users.find((user) => user.id === state.auth.currentUserId) ?? null;
}
