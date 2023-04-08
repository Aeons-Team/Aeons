/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true
  },
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/drive/root'
      },

      {
        source: '/drive',
        destination: '/drive/root'
      }
    ]
  }
};

module.exports = nextConfig;
