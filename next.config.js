/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
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
