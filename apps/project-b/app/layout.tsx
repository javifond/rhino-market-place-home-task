import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Project B', default: 'Project B' },
  description: 'Project B — powered by Rhino Entertainment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
