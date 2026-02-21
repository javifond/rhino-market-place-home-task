import type { Market } from '@repo/types';

/**
 * Available feature flag identifiers.
 * Flags control conditional rendering of features per market.
 *
 * - `SHOW_REVIEWS`: Display product reviews section
 * - `ENABLE_WISHLIST`: Show wishlist/favorites functionality
 * - `SHOW_RELATED_PRODUCTS`: Display related products carousel
 */
export type FeatureFlag = 'SHOW_REVIEWS' | 'ENABLE_WISHLIST' | 'SHOW_RELATED_PRODUCTS';

/**
 * Feature flag matrix by market.
 * Enables gradual rollout and market-specific feature availability.
 *
 * Current configuration:
 * | Flag                  | en (English) | ca (Canada) |
 * |-----------------------|--------------|-------------|
 * | SHOW_REVIEWS          | ✓            | ✗           |
 * | ENABLE_WISHLIST       | ✓            | ✗           |
 * | SHOW_RELATED_PRODUCTS | ✗            | ✓           |
 *
 * @example
 * ```ts
 * // Direct access (not recommended, use isFeatureEnabled)
 * const showReviews = FEATURE_FLAGS['en']['SHOW_REVIEWS']; // true
 * ```
 */
export const FEATURE_FLAGS: Record<Market, Record<FeatureFlag, boolean>> = {
  en: { SHOW_REVIEWS: true, ENABLE_WISHLIST: true, SHOW_RELATED_PRODUCTS: false },
  ca: { SHOW_REVIEWS: false, ENABLE_WISHLIST: false, SHOW_RELATED_PRODUCTS: true },
};

/**
 * Check if a feature is enabled for a specific market.
 * Preferred method for feature flag checks — provides type safety.
 *
 * @param flag - The feature flag to check
 * @param market - The market context ('en' | 'ca')
 * @returns True if the feature is enabled for the given market
 *
 * @example
 * ```ts
 * // Conditional rendering in Server Component
 * const market = 'en';
 * const session = await getSession();
 *
 * // Reviews require both auth AND feature flag
 * const showReviews = session !== null && isFeatureEnabled('SHOW_REVIEWS', market);
 *
 * return (
 *   <ProductDetail product={product}>
 *     {showReviews && <ReviewsSection reviews={product.reviews} />}
 *   </ProductDetail>
 * );
 * ```
 */
export function isFeatureEnabled(flag: FeatureFlag, market: Market): boolean {
  return FEATURE_FLAGS[market][flag];
}
