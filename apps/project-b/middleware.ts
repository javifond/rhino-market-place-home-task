import { ROUTES, isValidMarket } from '@repo/constants';
import { jwtVerify } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Get the JWT signing key from environment.
 * Returns null if not configured (allows graceful degradation in edge cases).
 */
function getJwtKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

/**
 * URL patterns that require authentication.
 * Uses regex to match dynamic route segments.
 */
const PROTECTED_PATTERNS = [/^\/[a-z]{2}\/products(\/.*)?$/, /^\/[a-z]{2}\/product\/.*$/];

/**
 * Middleware for route protection.
 *
 * Protects product-related routes by verifying JWT session cookie.
 * Redirects unauthenticated users to login with callbackUrl preserved.
 *
 * Protected routes:
 * - /[market]/products — Product listing
 * - /[market]/product/* — Product detail pages
 *
 * @example
 * Unauthenticated user visits /en/products:
 * → Redirects to /en/login?callbackUrl=%2Fen%2Fproducts
 *
 * Authenticated user visits /en/products:
 * → Passes through to the page
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Check if route requires protection
  const isProtected = PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Extract market from pathname for redirect URL
  const marketSegment = pathname.split('/')[1];
  const market = isValidMarket(marketSegment) ? marketSegment : 'en';

  // Get session token from cookies
  const token = request.cookies.get('session')?.value;
  if (!token) {
    const loginUrl = new URL(ROUTES.login(market), request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT
  const key = getJwtKey();
  if (!key) {
    // No secret configured — deny access
    const loginUrl = new URL(ROUTES.login(market), request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    // Invalid or expired token
    const loginUrl = new URL(ROUTES.login(market), request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Matcher configuration for middleware.
 * Excludes static assets and internal Next.js routes.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
