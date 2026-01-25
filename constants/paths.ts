export const PUBLIC_PATHS = new Set(['/login', '/signup', '/forgot-password', '/update-password', '/error']);

export const API_PATHS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verifyEmail: '/auth/verify-email',
    resendEmail: '/auth/resend-email',
    requestPasswordReset: '/auth/request-password-reset',
    resetPassword: '/auth/reset-password',
  },
  users: {
    me: '/user',
  },
  itinerary: {
    create: '/itinerary/create',
  },
} as const;
