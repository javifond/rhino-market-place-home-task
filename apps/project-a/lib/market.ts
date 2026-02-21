import type { Market, MarketContent } from '@repo/types';

/**
 * Market-specific content configuration.
 *
 * Provides localized content for the welcome page based on the current market.
 * English market uses standard English, Canadian market uses bilingual French.
 *
 * @example
 * ```ts
 * const content = MARKET_CONTENT['en'];
 * // { title: 'Welcome — English Market', heroText: '...', ctaLabel: 'Browse Products' }
 * ```
 */
export const MARKET_CONTENT: Record<Market, MarketContent> = {
  en: {
    title: 'Welcome — English Market',
    heroText: 'Discover our full product catalogue.',
    ctaLabel: 'Browse Products',
  },
  ca: {
    title: 'Bienvenue — Marché Canadien',
    heroText: 'Découvrez notre catalogue complet.',
    ctaLabel: 'Parcourir les produits',
  },
};
