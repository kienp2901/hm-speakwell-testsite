const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    API_KEY_EXAM: process.env.API_KEY_EXAM,
    API_BASE_URL: process.env.API_BASE_URL,
    API_EMS_KEY: process.env.API_EMS_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apiems.hocmai.vn',
        pathname: '/resource/uploads/image/**',
      },
    ],
    domains: ['apiems.hocmai.vn'],
  },
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
};

module.exports = withPlugins([withBundleAnalyzer], nextConfig);

