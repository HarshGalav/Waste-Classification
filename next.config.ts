/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  }
}

module.exports = nextConfig