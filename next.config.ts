import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  reloadOnOnline: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^\/_next\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static',
          expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\/src\/data\/.+\.json$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'data-json',
          expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

// Bundle analyzer — only active when ANALYZE=true
async function buildConfig() {
  if (process.env.ANALYZE === 'true') {
    const { default: withBundleAnalyzer } = await import('@next/bundle-analyzer');
    return withBundleAnalyzer({ enabled: true })(withPWA(nextConfig));
  }
  return withPWA(nextConfig);
}

export default buildConfig();
