export type Market = 'en' | 'ca';

export interface MarketConfig {
  market: Market;
  label: string;
  locale: string;
  hreflang: string;
}

export interface MarketContent {
  title: string;
  heroText: string;
  ctaLabel: string;
}
