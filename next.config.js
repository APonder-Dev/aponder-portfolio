/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-slug'],
}

module.exports = nextConfig
