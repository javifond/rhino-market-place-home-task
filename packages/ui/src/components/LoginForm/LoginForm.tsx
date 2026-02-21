'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../Button';
import styles from './LoginForm.module.css';

export interface LoginFormProps {
  /** URL to redirect to after successful login */
  callbackUrl?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Login form component (Client Component).
 *
 * Provides email/password authentication with:
 * - Controlled inputs with validation
 * - Show/hide password toggle (accessible)
 * - Loading state during submission
 * - Inline error display with screen reader support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LoginForm />
 *
 * // With callback URL (from searchParams)
 * <LoginForm callbackUrl="/en/products" />
 *
 * // In a login page
 * export default function LoginPage({ searchParams }) {
 *   const callbackUrl = searchParams.callbackUrl;
 *   return (
 *     <div className="login-container">
 *       <h1>Sign In</h1>
 *       <LoginForm callbackUrl={callbackUrl} />
 *     </div>
 *   );
 * }
 * ```
 */
export function LoginForm({ callbackUrl, className }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        setError('Invalid email or password');
        return;
      }

      if (!response.ok) {
        setError('An error occurred. Please try again.');
        return;
      }

      // Redirect to callback URL or default to products page
      router.push(callbackUrl ?? '/en/products');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  const formClass = [styles.form, className].filter(Boolean).join(' ');

  return (
    <form onSubmit={handleSubmit} className={formClass} noValidate>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="you@example.com"
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <Button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
