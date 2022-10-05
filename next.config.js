/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    REDIS_URL: process.env.REDIS_URL
  }
}

module.exports = nextConfig
