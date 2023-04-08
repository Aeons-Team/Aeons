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
        destination: '/drive/root',
        permanent: false
      },

      {
        source: '/drive',
        destination: '/drive/root',
        permanent: false
      }
    ]
  }
};

module.exports = nextConfig;
