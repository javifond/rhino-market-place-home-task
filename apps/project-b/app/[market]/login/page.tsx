import { getSession } from '@/lib/auth';
import { ROUTES } from '@repo/constants';
import { LoginForm } from '@repo/ui';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  params: Promise<{ market: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}

/**
 * Login page for Project B.
 *
 * - Redirects authenticated users to products page
 * - Passes callbackUrl from searchParams to LoginForm
 * - SEO: noindex to prevent login page from appearing in search
 *
 * @example URL patterns:
 * - /en/login — Default login
 * - /en/login?callbackUrl=/en/products — Redirect after login
 * - /ca/login?callbackUrl=/ca/product/123 — Return to specific product
 */
export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { market } = await params;
  const { callbackUrl } = await searchParams;

  // Redirect authenticated users to products
  const session = await getSession();
  if (session) {
    redirect(ROUTES.products(market));
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in to Project B</h1>
        <p className={styles.subtitle}>Enter your credentials to access your account</p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
