// filepath: /home/khoi/Documents/IU/thesis/lcasystem-FE/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ... other configurations
  publicRuntimeConfig: {
    NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  },
};

export default nextConfig;
