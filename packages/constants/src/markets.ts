import type { Market, MarketConfig } from '@repo/types';

/**
 * Supported market identifiers.
 * Used for URL routing and content localization.
 *
 * @example
 * ```ts
 * // Valid market segments: /en/products, /ca/products
 * MARKETS.forEach(market => console.log(`/${market}/products`));
 * ```
 */
export const MARKETS = ['en', 'ca'] as const;

/**
 * Default market used for redirects and fallbacks.
 *
 * @example
 * ```ts
 * // Redirect root to default market
 * redirect(`/${DEFAULT_MARKET}`); // redirects to /en
 * ```
 */
export const DEFAULT_MARKET: Market = 'en';

/**
 * Market configuration mapping with locale and SEO metadata.
 *
 * @example
 * ```ts
 * // Get locale for date formatting
 * const config = MARKET_CONFIGS['ca'];
 * new Date().toLocaleDateString(config.locale); // "en-CA" format
 *
 * // Generate hreflang tags for SEO
 * Object.values(MARKET_CONFIGS).map(c =>
 *   `<link rel="alternate" hreflang="${c.hreflang}" href="/${c.market}" />`
 * );
 * ```
 */
export const MARKET_CONFIGS: Record<Market, MarketConfig> = {
  en: { market: 'en', label: 'English', locale: 'en-US', hreflang: 'en' },
  ca: { market: 'ca', label: 'Canada', locale: 'en-CA', hreflang: 'en-CA' },
};

/**
 * Type guard to validate if a value is a supported market.
 * Use for runtime validation of dynamic route params.
 *
 * @param value - Unknown value to validate (typically from URL params)
 * @returns True if value is a valid Market ('en' | 'ca')
 *
 * @example
 * ```ts
 * // In a Next.js page component
 * const { market } = await params;
 * if (!isValidMarket(market)) {
 *   notFound(); // Returns 404 for invalid markets
 * }
 * // market is now typed as Market
 * ```
 */
export function isValidMarket(value: unknown): value is Market {
  return MARKETS.includes(value as Market);
}
