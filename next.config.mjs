/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/duct',
  assetPrefix: '/duct',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
