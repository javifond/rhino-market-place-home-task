import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Project A', default: 'Project A' },
  description: 'Project A — powered by Rhino Entertainment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
