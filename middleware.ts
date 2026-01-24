import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set(['/login', '/signup', '/forgot-password', '/update-password', '/error']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Let the app decide auth state
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
