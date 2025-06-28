import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'moit.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;
