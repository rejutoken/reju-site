import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/rejunomics",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, ...securityHeaders],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/reju-access", destination: "/onboarding", permanent: true },
      { source: "/rejunomics", destination: "/program", permanent: true },
      { source: "/dailyjournal", destination: "/daily-transformation-log", permanent: true },
      {
        source: "/blog/the-clarity-act-bringing-much-needed-regulatory-clarity-to-crypto-and-why-reju-is-already-aligned",
        destination: "/program",
        permanent: true,
      },
      {
        source: "/blog/rejunomics-the-disclosure-standard-investors-can-actually-read",
        destination: "/program",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
