/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth', 'pg', 'bcryptjs'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
