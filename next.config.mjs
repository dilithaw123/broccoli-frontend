/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        missing: [
          {
            type: "cookie",
            key: "session",
          },
        ],
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
