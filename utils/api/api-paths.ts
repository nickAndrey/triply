export const API_PATHS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/user',
    profile: '/users/profile',
  },
} as const;
