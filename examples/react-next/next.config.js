/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV);
const nextConfig = {
  assetPrefix: isProd ? '/polkadot-onboard/' : '',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
