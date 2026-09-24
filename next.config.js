/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // The interactive pages were folded into the single-page site.
  async redirects() {
    return [
      { source: "/systems", destination: "/#systems", permanent: true },
      { source: "/throttle", destination: "/#systems", permanent: true },
    ];
  },
};

module.exports = nextConfig;
