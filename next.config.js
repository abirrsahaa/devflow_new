/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
    ],
  },
  serverComponentsExternalPackages: ['mongoose'],
  // Uncomment and move to the main config if these features are stable
  // serverActions: true,
  // mdxRs: true,
};

module.exports = nextConfig;
