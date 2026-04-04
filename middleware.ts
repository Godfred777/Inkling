import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated by looking for auth session in cookies/localStorage
  // Note: For client-side auth with localStorage, we need a different approach
  // This middleware works best with server-side session management
  
  // For now, we'll just allow all routes and handle auth on the client side
  // In production, you'd want to use JWT cookies or server-side sessions
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Get auth token from cookie (if using cookie-based auth)
  const token = request.cookies.get('inkling_auth_token')?.value;
  
  // If trying to access auth page while logged in, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If trying to access protected route while not logged in, redirect to login
  if (!isPublicRoute && !token) {
    // For now, allow access - client-side auth will handle redirection
    // In production, uncomment this:
    // return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
