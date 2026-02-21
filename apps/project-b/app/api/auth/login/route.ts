import users from '@/data/users.json';
import { createSession } from '@/lib/auth';
import type { User, UserPayload } from '@repo/types';
import { compare } from 'bcryptjs';

/**
 * Type guard for login request body.
 * Validates that body contains email and password strings.
 */
function isLoginBody(body: unknown): body is { email: string; password: string } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'email' in body &&
    'password' in body &&
    typeof (body as Record<string, unknown>).email === 'string' &&
    typeof (body as Record<string, unknown>).password === 'string'
  );
}

/**
 * Artificial delay to prevent timing-based user enumeration.
 * Applied regardless of whether user exists or password is correct.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email and password.
 *
 * Request body:
 * ```json
 * { "email": "user@example.com", "password": "password123" }
 * ```
 *
 * Responses:
 * - 200: Success, returns UserPayload (no passwordHash)
 * - 400: Malformed request body
 * - 401: Invalid credentials
 *
 * @example
 * ```ts
 * const res = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@project-b.com', password: 'password123' }),
 * });
 * if (res.ok) {
 *   const user = await res.json();
 *   router.push('/en/products');
 * }
 * ```
 */
export async function POST(request: Request): Promise<Response> {
  // Apply timing-safe delay
  await delay(100);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isLoginBody(body)) {
    return Response.json({ error: 'Missing required fields: email and password' }, { status: 400 });
  }

  const { email, password } = body;

  // Find user by email
  const user = (users as User[]).find((u) => u.email === email);
  if (!user) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Verify password
  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Create session (excludes passwordHash)
  const userPayload: UserPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  await createSession(userPayload);

  return Response.json(userPayload);
}
