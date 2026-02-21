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
 * Project B ProductCard override.
 *
 * Brand-specific defaults for Project B (red theme):
 * - Layout: horizontal (image on left)
 * - Categories: shown
 * - Thumbnails: 2 images
 * - Action: "Hello from Red Project" alert
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
    alert('Hello from Red Project');
  }

  return (
    <BaseProductCard
      product={product}
      layout="horizontal"
      showCategories={true}
      thumbnailCount={2}
      actionLabel="Hello from Red Project"
      onAction={handleAction}
      className={className}
    />
  );
}
