import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect /admin routes by checking for a simple cookie set by the admin login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const cookie = req.cookies.get('hansraj_admin')?.value;
    if (cookie !== '1') {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
