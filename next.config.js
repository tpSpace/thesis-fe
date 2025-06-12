/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Configure base path for /app routing
  basePath: '/app',
  // Asset prefix for static files
  assetPrefix: '/app',
  // ... other configurations
  publicRuntimeConfig: {
    NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  },
};

export default nextConfig;
