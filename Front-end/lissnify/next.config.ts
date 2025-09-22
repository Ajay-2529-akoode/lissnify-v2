/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone', // required for Netlify serverless
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'out'
};

module.exports = nextConfig;
