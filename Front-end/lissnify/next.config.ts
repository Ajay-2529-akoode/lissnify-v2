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
};

module.exports = nextConfig;
