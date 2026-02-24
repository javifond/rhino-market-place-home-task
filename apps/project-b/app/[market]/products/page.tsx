import { ProductCard } from '@/components/overrides/ProductCard';
import { getSession } from '@/lib/auth';
import { fetchProducts } from '@repo/api';
import { isValidMarket } from '@repo/constants';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Generates metadata based on auth state.
 * Authenticated views are noindex to prevent indexing personalized content.
 */
export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { market } = await params;

  if (!isValidMarket(market)) {
    return {};
  }

  const session = await getSession();
  const isAuthenticated = session !== null;

  return {
    title: 'Products',
    description: 'Browse our full product catalogue.',
    robots: isAuthenticated ? { index: false, follow: false } : { index: true, follow: true },
  };
}

interface ProductsPageProps {
  params: Promise<{ market: string }>;
}

/**
 * Products listing page with ISR.
 *
 * Displays a grid of product cards. Uses 5-minute cache revalidation
 * with product shuffling to demonstrate ISR functionality.
 */
export default async function ProductsPage({ params }: ProductsPageProps) {
  const { market } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const { products } = await fetchProducts({ shuffle: true });

  return (
    <section
      style={{
        padding: 'var(--space-6)',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text)',
          marginBottom: 'var(--space-6)',
        }}
      >
        Products
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} market={market} />
        ))}
      </div>
    </section>
  );
}
