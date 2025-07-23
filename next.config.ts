import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* configconst nextConfig: NextConfig = {
    /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: path.resolve(
        __dirname,
        "node_modules/html2canvas-pro"
      ),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      html2canvas: "html2canvas-pro",
    },
  },
};

export default nextConfig;
