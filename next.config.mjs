/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { instrumentationHook: true },
  redirects: async () => [
    {
      source: "/",
      destination: "/app",
      permanent: false,
    },
  ],
};

export default nextConfig;
