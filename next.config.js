/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/drive/root',
        permanent: true
      },

      {
        source: '/drive',
        destination: '/drive/root',
        permanent: true
      }
    ]
  }
};

module.exports = nextConfig;
