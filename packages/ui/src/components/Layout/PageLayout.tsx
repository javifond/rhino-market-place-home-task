import type { Market, NavConfig } from '@repo/types';
import type { ReactNode } from 'react';
import { Nav } from '../Nav';
import styles from './PageLayout.module.css';

export interface PageLayoutProps {
  /** Navigation configuration (position and brand) */
  navConfig: NavConfig;
  /** Current market for navigation */
  currentMarket: Market;
  /** Optional brand logo */
  logo?: ReactNode;
  /** Page content */
  children: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Additional CSS class for main content area */
  className?: string;
}

/**
 * Page layout wrapper (Server Component).
 *
 * Provides consistent page structure with navigation, main content area,
 * and optional footer. Automatically adjusts layout based on nav position:
 * - `top`: Vertical stack (nav above content)
 * - `side`: Horizontal split (nav beside content)
 *
 * @example
 * ```tsx
 * // Top navigation layout (brand-a)
 * <PageLayout
 *   navConfig={{ position: 'top', brandId: 'brand-a' }}
 *   currentMarket="en"
 *   logo={<span>Project A</span>}
 *   footer={<Footer />}
 * >
 *   <ProductGrid products={products} />
 * </PageLayout>
 *
 * // Side navigation layout (brand-b)
 * <PageLayout
 *   navConfig={{ position: 'side', brandId: 'brand-b' }}
 *   currentMarket="ca"
 *   logo={<Logo />}
 * >
 *   <article>{children}</article>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  navConfig,
  currentMarket,
  logo,
  children,
  footer,
  className,
}: PageLayoutProps) {
  const layoutClass = [
    styles.layout,
    navConfig.position === 'side' ? styles.withSidebar : styles.withTopNav,
  ]
    .filter(Boolean)
    .join(' ');

  const mainClass = [styles.main, className].filter(Boolean).join(' ');

  return (
    <div className={layoutClass}>
      <Nav config={navConfig} currentMarket={currentMarket} logo={logo} />

      <div className={styles.content}>
        <main className={mainClass}>{children}</main>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
