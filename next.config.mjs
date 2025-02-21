/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        't0.gstatic.com',
        'www.google.com',
        // Add other domains you need
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.google.com',
          pathname: '/s2/favicons/**',
        },
      ],
    },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.openai.com/:path*",
      },
    ];
  },
};



export default nextConfig;
