/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'e1.pxfuel.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
    ],
  },
}

module.exports = nextConfig
