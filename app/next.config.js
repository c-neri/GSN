/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
      env: {
        PAYMASTER: process.env.PAYMASTER,
    },
}

module.exports = nextConfig
