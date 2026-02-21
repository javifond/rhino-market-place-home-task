import { isValidMarket } from '@repo/constants';
import type { Market, NavConfig } from '@repo/types';
import { PageLayout } from '@repo/ui';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

interface MarketLayoutProps {
  children: ReactNode;
  params: Promise<{ market: string }>;
}

/**
 * Market-scoped layout for Project B.
 *
 * Validates the market parameter and renders the page layout
 * with side navigation (brand-b configuration).
 */
export default async function MarketLayout({ children, params }: MarketLayoutProps) {
  const { market } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const navConfig: NavConfig = {
    position: 'side',
    brandId: 'brand-b',
  };

  return (
    <PageLayout
      navConfig={navConfig}
      currentMarket={market as Market}
      logo={<span>Project B</span>}
    >
      {children}
    </PageLayout>
  );
}
