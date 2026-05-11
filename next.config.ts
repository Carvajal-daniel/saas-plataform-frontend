/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: false, // força webpack
  },
};

module.exports = nextConfig;