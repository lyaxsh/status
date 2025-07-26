/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    swcMinify: true,
  },
  swcMinify: true,
};

module.exports = nextConfig;