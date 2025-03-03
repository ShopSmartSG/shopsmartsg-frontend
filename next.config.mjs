/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: '/offline', revision: '1' }
  ]
});

export default withSerwist({
  images: {
    domains: ["via.placeholder.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
  reactStrictMode:false
});