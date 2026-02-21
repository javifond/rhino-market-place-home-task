'use client';

import { ROUTES } from '@repo/constants';
import type { Market, Product } from '@repo/types';
import { ProductCard as BaseProductCard } from '@repo/ui';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Current market for navigation */
  market: Market;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * Project B ProductCard override.
 *
 * Brand-specific defaults for Project B (red theme):
 * - Layout: horizontal (image on left)
 * - Categories: shown
 * - Thumbnails: 2 images
 * - Action: navigates to product detail page
 *
 * This is a Client Component because it uses an onClick handler.
 *
 * @example
 * ```tsx
 * // In a product listing page
 * {products.map((product) => (
 *   <ProductCard key={product.id} product={product} market="en" />
 * ))}
 * ```
 */
export function ProductCard({ product, market, className }: ProductCardProps) {
  const router = useRouter();

  function handleAction() {
    router.push(ROUTES.product(market, String(product.id)));
  }

  return (
    <BaseProductCard
      product={product}
      layout="horizontal"
      showCategories={true}
      thumbnailCount={2}
      actionLabel="View Details"
      onAction={handleAction}
      className={className}
    />
  );
}
