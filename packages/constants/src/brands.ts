import type { BrandConfig, BrandId } from '@repo/types';

/**
 * Available brand identifiers.
 * Each brand represents a distinct white-label deployment.
 *
 * @example
 * ```ts
 * // Validate brand in configuration
 * if (!BRAND_IDS.includes(brandId)) {
 *   throw new Error(`Unknown brand: ${brandId}`);
 * }
 * ```
 */
export const BRAND_IDS = ['brand-a', 'brand-b'] as const;

/**
 * Brand configuration mapping defining visual and behavioral settings.
 *
 * - `navPosition`: Controls navigation layout
 *   - `'top'`: Horizontal nav bar (brand-a)
 *   - `'side'`: Vertical sidebar (brand-b)
 *
 * @example
 * ```ts
 * // Get brand config for layout rendering
 * const brand = BRAND_CONFIGS['brand-a'];
 * // { id: 'brand-a', name: 'Project A', navPosition: 'top' }
 *
 * // Use in PageLayout component
 * <PageLayout navConfig={{ position: brand.navPosition, brandId: brand.id }}>
 *   {children}
 * </PageLayout>
 * ```
 */
export const BRAND_CONFIGS: Record<BrandId, BrandConfig> = {
  'brand-a': { id: 'brand-a', name: 'Project A', navPosition: 'top' },
  'brand-b': { id: 'brand-b', name: 'Project B', navPosition: 'side' },
};
