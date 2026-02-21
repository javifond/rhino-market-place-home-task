import type { UserPayload } from '@repo/types';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

/**
 * Session cookie configuration.
 * - httpOnly: Prevents XSS access to token
 * - secure: HTTPS only in production
 * - sameSite: CSRF protection
 * - path: Available across all routes
 */
const COOKIE_NAME = 'session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Get the JWT signing key from environment.
 * Must be at least 32 characters for HS256.
 *
 * @throws Error if JWT_SECRET is not configured
 */
function getJwtKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a new session for the authenticated user.
 * Signs a JWT with the user payload and sets it as an httpOnly cookie.
 *
 * @param user - User payload to encode in the session (excludes passwordHash)
 *
 * @example
 * ```ts
 * // In login API route after password verification
 * const { passwordHash, ...userPayload } = user;
 * await createSession(userPayload);
 * return Response.json(userPayload);
 * ```
 */
export async function createSession(user: UserPayload): Promise<void> {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getJwtKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Retrieve the current session from the request cookies.
 * Returns null if no session exists or if the JWT is invalid/expired.
 * Never throws — safe to call in any context.
 *
 * @returns UserPayload if valid session exists, null otherwise
 *
 * @example
 * ```ts
 * // In a Server Component or API route
 * const session = await getSession();
 * if (!session) {
 *   redirect('/en/login');
 * }
 * // session.user is now available
 * ```
 */
export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtKey());
    return payload.user as UserPayload;
  } catch {
    // Invalid or expired token — return null, never throw
    return null;
  }
}

/**
 * Destroy the current session by expiring the session cookie.
 * Safe to call even if no session exists.
 *
 * @example
 * ```ts
 * // In logout API route
 * await destroySession();
 * return new Response(null, { status: 200 });
 * ```
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Immediate expiration
  });
}
