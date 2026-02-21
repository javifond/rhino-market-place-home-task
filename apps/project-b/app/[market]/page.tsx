import { MARKET_CONTENT } from '@/lib/market';
import { ROUTES, isValidMarket } from '@repo/constants';
import type { Market } from '@repo/types';
import { Button } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface WelcomePageProps {
  params: Promise<{ market: string }>;
}

/**
 * Generates market-specific metadata for SEO.
 */
export async function generateMetadata({ params }: WelcomePageProps): Promise<Metadata> {
  const { market } = await params;

  if (!isValidMarket(market)) {
    return {};
  }

  const content = MARKET_CONTENT[market];

  return {
    title: content.title,
    description: content.heroText,
  };
}

/**
 * Welcome page (Server Component).
 *
 * Renders market-specific hero content with a CTA linking to the products page.
 */
export default async function WelcomePage({ params }: WelcomePageProps) {
  const { market } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const content = MARKET_CONTENT[market as Market];

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 'var(--space-8)',
        gap: 'var(--space-6)',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--text-3xl)',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text)',
        }}
      >
        {content.title}
      </h1>

      <p
        style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-text-muted)',
          maxWidth: '600px',
        }}
      >
        {content.heroText}
      </p>

      <Link href={ROUTES.products(market)}>
        <Button variant="primary" size="lg">
          {content.ctaLabel}
        </Button>
      </Link>
    </section>
  );
}
