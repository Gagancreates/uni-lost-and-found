import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define paths that are considered public (don't require auth)
  const isPublicPath = path === '/auth/login' || path === '/auth/register';
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value || '';
  
  // If already logged in and trying to access auth pages, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/auth/:path*',
  ],
}; 