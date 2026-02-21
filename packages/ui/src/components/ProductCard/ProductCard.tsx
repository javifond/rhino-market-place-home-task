import type { Product } from '@repo/types';
import { Button } from '../Button';
import styles from './ProductCard.module.css';

/**
 * Card layout orientation.
 * - `vertical`: Image on top, content below (column flex)
 * - `horizontal`: Image on left, content on right (row flex)
 */
export type ProductCardLayout = 'vertical' | 'horizontal';

export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Card layout orientation */
  layout?: ProductCardLayout;
  /** Whether to show category tags */
  showCategories?: boolean;
  /** Number of thumbnail images to display (1 or 2) */
  thumbnailCount?: 1 | 2;
  /** Custom label for the action button */
  actionLabel?: string;
  /** Callback when action button is clicked (requires client wrapper) */
  onAction?: () => void;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * Product card component (Server Component).
 *
 * Displays product information with configurable layout and display options.
 * For interactive features (onAction), wrap in a Client Component.
 *
 * Layout variants:
 * - `vertical`: Traditional card with image stacked above content
 * - `horizontal`: Wide card with image beside content (good for lists)
 *
 * @example
 * ```tsx
 * // Basic vertical card
 * <ProductCard product={product} />
 *
 * // Horizontal layout with categories
 * <ProductCard
 *   product={product}
 *   layout="horizontal"
 *   showCategories
 *   thumbnailCount={2}
 * />
 *
 * // With custom action (requires 'use client' wrapper)
 * <ProductCard
 *   product={product}
 *   actionLabel="Add to Cart"
 *   onAction={() => addToCart(product.id)}
 * />
 * ```
 */
export function ProductCard({
  product,
  layout = 'vertical',
  showCategories = false,
  thumbnailCount = 1,
  actionLabel = 'View Details',
  onAction,
  className,
}: ProductCardProps) {
  const cardClass = [
    styles.card,
    layout === 'vertical' ? styles.vertical : styles.horizontal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Get thumbnails to display
  const thumbnails = product.images.slice(0, thumbnailCount);

  // Format price with discount if applicable
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  return (
    <article className={cardClass}>
      <div className={styles.imageContainer}>
        {thumbnails.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={index === 0 ? product.title : `${product.title} - image ${index + 1}`}
            className={styles.image}
            loading="lazy"
          />
        ))}
      </div>

      <div className={styles.content}>
        {showCategories && (
          <div className={styles.categories}>
            <span className={styles.categoryTag}>{product.category}</span>
          </div>
        )}

        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.rating}>
          <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
          <span className={styles.ratingStar}>★</span>
        </div>

        <div className={styles.pricing}>
          {hasDiscount && discountedPrice !== null ? (
            <>
              <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
              <span className={styles.discountedPrice}>${discountedPrice.toFixed(2)}</span>
              <span className={styles.discountBadge}>
                -{Math.round(product.discountPercentage)}%
              </span>
            </>
          ) : (
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className={styles.stock}>
          {product.stock > 0 ? (
            <span className={styles.inStock}>{product.stock} in stock</span>
          ) : (
            <span className={styles.outOfStock}>Out of stock</span>
          )}
        </div>

        {onAction ? (
          <Button
            type="button"
            onClick={onAction}
            className={styles.actionButton}
            disabled={product.stock === 0}
          >
            {actionLabel}
          </Button>
        ) : (
          <Button type="button" className={styles.actionButton} disabled={product.stock === 0}>
            {actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
}
