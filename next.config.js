/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  experimental: {
    proxyClientMaxBodySize: '512mb',
  },

  images: {
    unoptimized: true,
  },

  transpilePackages: [
    'react-markdown',
    'remark-gfm',
    'rehype-highlight',
    'rehype-slug',
  ],
}

module.exports = nextConfig
