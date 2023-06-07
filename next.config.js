/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ANKR_ENDPOINT: process.env.ANKR_ENDPOINT,
  },
};

module.exports = nextConfig;
