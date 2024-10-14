/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:9090", "192.168.1.192:9090"],
    },
  },
};

export default nextConfig;
