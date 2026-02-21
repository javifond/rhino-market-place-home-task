import { ProductCard } from '@/components/overrides/ProductCard';
import { getSession } from '@/lib/auth';
import { isValidMarket } from '@repo/constants';
import type { Product, ProductList } from '@repo/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProductsPageProps {
  params: Promise<{ market: string }>;
}

/**
 * Fetches products from the API with ISR caching (5 minute revalidation).
 * Shuffles the first 10 products to evidence cache refreshes.
 */
async function fetchProducts(): Promise<ProductList> {
  const res = await fetch(
    'https://dummyjson.com/products?limit=30&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images',
    {
      next: { revalidate: 300, tags: ['products'] },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data: ProductList = await res.json();

  // Shuffle first 10 for content variation (evidences ISR is working)
  const products = [...data.products];
  const top10 = products.splice(0, 10);

  for (let i = top10.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top10[i], top10[j]] = [top10[j] as Product, top10[i] as Product];
  }

  const shuffled = [...top10, ...products];

  // biome-ignore lint/suspicious/noConsoleLog: intentional ISR content-change marker
  console.log(
    `[ISR] Products cache refreshed at ${new Date().toISOString()} — first item: ${shuffled[0]?.title}`,
  );

  return { ...data, products: shuffled };
}

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

  const { products } = await fetchProducts();

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
