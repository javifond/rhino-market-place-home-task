import { destroySession } from '@/lib/auth';

/**
 * POST /api/auth/logout
 *
 * Destroys the current session by expiring the session cookie.
 * Safe to call even if no session exists.
 *
 * Responses:
 * - 200: Success (always)
 *
 * @example
 * ```ts
 * await fetch('/api/auth/logout', { method: 'POST' });
 * router.push('/en/login');
 * ```
 */
export async function POST(): Promise<Response> {
  await destroySession();
  return new Response(null, { status: 200 });
}
