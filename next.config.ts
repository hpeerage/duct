import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages 서비스 경로에 맞게 설정 (https://hpeerage.github.io/duct/)
  basePath: '/duct',
  assetPrefix: '/duct',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
