import '@repo/ui/styles/reset.css';
import '@repo/ui/styles/tokens.css';
import '@repo/ui/styles/brand-a.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Project A', default: 'Project A' },
  description: 'Project A — powered by Rhino Entertainment',
};

/**
 * Root layout for Project A (Brand A).
 *
 * CSS import order matters:
 * 1. reset.css — Browser normalization
 * 2. tokens.css — Base design tokens (:root)
 * 3. brand-a.css — Brand-specific overrides ([data-brand="brand-a"])
 *
 * The data-brand attribute enables CSS custom property overrides
 * without JavaScript runtime cost.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="brand-a">
      <body>{children}</body>
    </html>
  );
}
