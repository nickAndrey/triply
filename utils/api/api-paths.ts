export const API_PATHS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verifyEmail: '/auth/verify-email',
    resendEmail: '/auth/resend-email',
  },
  users: {
    me: '/user',
    profile: '/users/profile',
  },
} as const;
