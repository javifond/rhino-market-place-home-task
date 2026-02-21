import { MARKET_CONFIGS, ROUTES } from '@repo/constants';
import type { Market, NavConfig } from '@repo/types';
import type { ReactNode } from 'react';
import styles from './Nav.module.css';

export interface NavProps {
  /** Navigation configuration (position and brand) */
  config: NavConfig;
  /** Current market for active state */
  currentMarket: Market;
  /** Optional brand logo or name */
  logo?: ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * Navigation component (Server Component).
 *
 * Renders either a horizontal top bar or vertical sidebar based on
 * `config.position`. Includes market switcher links for i18n navigation.
 *
 * Layout is controlled purely via CSS classes — no inline styles or
 * JavaScript-based positioning.
 *
 * @example
 * ```tsx
 * // Top navigation (brand-a default)
 * <Nav
 *   config={{ position: 'top', brandId: 'brand-a' }}
 *   currentMarket="en"
 *   logo={<span>Project A</span>}
 * />
 *
 * // Side navigation (brand-b default)
 * <Nav
 *   config={{ position: 'side', brandId: 'brand-b' }}
 *   currentMarket="ca"
 *   logo={<img src="/logo.svg" alt="Project B" />}
 * />
 * ```
 */
export function Nav({ config, currentMarket, logo, className }: NavProps) {
  const navClass = [styles.nav, config.position === 'top' ? styles.top : styles.side, className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClass} aria-label="Main navigation">
      <div className={styles.brand}>{logo}</div>

      <ul className={styles.links}>
        <li>
          <a href={ROUTES.home(currentMarket)} className={styles.link}>
            Home
          </a>
        </li>
        <li>
          <a href={ROUTES.products(currentMarket)} className={styles.link}>
            Products
          </a>
        </li>
      </ul>

      <div className={styles.marketSwitcher}>
        {Object.values(MARKET_CONFIGS).map((market) => (
          <a
            key={market.market}
            href={ROUTES.home(market.market)}
            className={[styles.marketLink, market.market === currentMarket ? styles.active : '']
              .filter(Boolean)
              .join(' ')}
            aria-current={market.market === currentMarket ? 'page' : undefined}
          >
            {market.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
