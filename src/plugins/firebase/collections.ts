export const Collection = {
  USERS: 'users',
  USER_COUNTERS: (userId: string) => `users/${userId}/counters`,
}
