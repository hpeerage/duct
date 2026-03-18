/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/duct',
  assetPrefix: '/duct',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avtdtuiocdiycmtpykid.supabase.co',
      },
    ],
  },
};

export default nextConfig;
