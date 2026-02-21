import '@repo/ui/styles/reset.css';
import '@repo/ui/styles/tokens.css';
import '@repo/ui/styles/brand-b.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Project B', default: 'Project B' },
  description: 'Project B — powered by Rhino Entertainment',
};

/**
 * Root layout for Project B (Brand B).
 *
 * CSS import order matters:
 * 1. reset.css — Browser normalization
 * 2. tokens.css — Base design tokens (:root)
 * 3. brand-b.css — Brand-specific overrides ([data-brand="brand-b"])
 *
 * The data-brand attribute enables CSS custom property overrides
 * without JavaScript runtime cost.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="brand-b">
      <body>{children}</body>
    </html>
  );
}
