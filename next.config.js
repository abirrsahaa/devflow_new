/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  typescript: {
=======
    typescript: {
>>>>>>> 4cd47b61b136fd9e2a6bc9f88ca49214727e11cd
    // !! WARN !! 
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
