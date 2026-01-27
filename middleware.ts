import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 *
 * Note: Authentication is primarily handled by client-side ProtectedRoute components
 * since Zustand persist uses localStorage which is not accessible in middleware.
 * This middleware is kept minimal for future server-side logic.
 */

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Client-side ProtectedRoute components will handle authentication
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
