'use client';

import type { Product } from '@repo/types';
import { ProductCard as BaseProductCard } from '@repo/ui';

interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * Project A ProductCard override.
 *
 * Brand-specific defaults for Project A (green theme):
 * - Layout: vertical (image on top)
 * - Categories: hidden
 * - Thumbnails: 1 image
 * - Action: "Hello from Green Project" alert
 *
 * This is a Client Component because it uses an onClick handler.
 *
 * @example
 * ```tsx
 * // In a product listing page
 * {products.map((product) => (
 *   <ProductCard key={product.id} product={product} />
 * ))}
 * ```
 */
export function ProductCard({ product, className }: ProductCardProps) {
  function handleAction() {
    alert('Hello from Green Project');
  }

  return (
    <BaseProductCard
      product={product}
      layout="vertical"
      showCategories={false}
      thumbnailCount={1}
      actionLabel="Hello from Green Project"
      onAction={handleAction}
      className={className}
    />
  );
}
