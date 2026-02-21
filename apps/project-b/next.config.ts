import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/constants'],
};

export default nextConfig;
