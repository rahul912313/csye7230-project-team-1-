import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === 'development', // ✅ DISABLE PWA IN DEVELOPMENT
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

export default {
  ...nextConfig,
  reactStrictMode: false,
  
  // Performance optimizations
  swcMinify: true,
  
  // Speed up dev compilation
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next'],
      };
    }
    return config;
  },
};
