import type { BrandId, Market } from '@repo/types';

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
 */
export const FEATURE_FLAGS: Record<Market, Record<FeatureFlag, boolean>> = {
  en: { SHOW_REVIEWS: true, ENABLE_WISHLIST: true, SHOW_RELATED_PRODUCTS: false },
  ca: { SHOW_REVIEWS: false, ENABLE_WISHLIST: false, SHOW_RELATED_PRODUCTS: true },
};

/**
 * Brand-specific feature overrides.
 * These take precedence over market-based flags.
 */
export const BRAND_FEATURE_OVERRIDES: Partial<
  Record<BrandId, Partial<Record<FeatureFlag, boolean>>>
> = {
  'brand-a': {
    SHOW_REVIEWS: false,
  },
  'brand-b': {
    SHOW_REVIEWS: true,
  },
};

/**
 * Check if a feature is enabled for a specific market and brand.
 * Preferred method for feature flag checks — provides type safety.
 *
 * Checks brand overrides first, then falls back to market defaults.
 *
 * @param flag - The feature flag to check
 * @param market - The market context ('en' | 'ca')
 * @param brandId - The brand context ('brand-a' | 'brand-b')
 * @returns True if the feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag, market: Market, brandId?: BrandId): boolean {
  // Check for brand override first
  if (brandId && BRAND_FEATURE_OVERRIDES[brandId]?.[flag] !== undefined) {
    return BRAND_FEATURE_OVERRIDES[brandId][flag] as boolean;
  }

  // Fallback to market default
  return FEATURE_FLAGS[market][flag];
}
