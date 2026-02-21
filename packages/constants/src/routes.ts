/**
 * Route path generators for type-safe navigation.
 * All routes are prefixed with the market segment.
 *
 * @example
 * ```ts
 * // Navigation
 * <Link href={ROUTES.products('en')}>Browse Products</Link>
 * // Output: /en/products
 *
 * // Redirect after login
 * router.push(ROUTES.product('ca', '123'));
 * // Output: /ca/product/123
 *
 * // Login with callback
 * const loginUrl = `${ROUTES.login(market)}?callbackUrl=${encodeURIComponent(pathname)}`;
 * ```
 */
export const ROUTES = {
  /** Home page: `/{market}` */
  home: (market: string) => `/${market}`,

  /** Login page: `/{market}/login` */
  login: (market: string) => `/${market}/login`,

  /** Product listing: `/{market}/products` */
  products: (market: string) => `/${market}/products`,

  /** Product detail: `/{market}/product/{slug}` */
  product: (market: string, slug: string) => `/${market}/product/${slug}`,
} as const;
