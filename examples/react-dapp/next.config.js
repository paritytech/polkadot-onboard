/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
console.log(`isProd: ${isProd}`);
const nextConfig = {
  assetPrefix: isProd ? '/wallet-aggregator-sdk/' : '',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
