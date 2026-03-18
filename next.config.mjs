/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/duct',
  assetPrefix: '/duct',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
