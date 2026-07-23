/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "localhost",
      "aigamestudio.com",
      "minio.local",
      "s3.amazonaws.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;