const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
})({
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
});

module.exports = nextConfig;
