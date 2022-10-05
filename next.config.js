/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REDIS_URL: process.env.REDIS_URL
  }
}

module.exports = nextConfig
