import type { NextConfig } from "next";
import createNextIntPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Forces a static export
  basePath: '/app', // Replace with your repository name
  images: {
    unoptimized: true, // Required because Next.js Image Optimization isn't supported on static hosts
  },
};

const withNextIntl = createNextIntPlugin("./app/i18n/request.ts");

export default withNextIntl(nextConfig);
