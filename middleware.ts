import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set(['/login', '/signup', '/forgot-password', '/update-password', '/error']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth APIs
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Check refresh token (HttpOnly cookie)
  const hasRefreshToken = request.cookies.has('refreshToken');
  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
