import type { NextConfig } from "next";
import createNextIntPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntPlugin("./app/i18n/request.ts");

export default withNextIntl(nextConfig);
