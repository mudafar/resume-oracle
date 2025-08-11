import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* configconst nextConfig: NextConfig = {
    /* config options here */
  output: "export",
  basePath: process.env.PAGES_BASE_PATH || "resume-oracle",
  typescript: {
    // TODO: remove the ignoreBuildErrors option after fixing the type errors.
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // TODO: remove the ignoreDuringBuilds option after fixing the lint errors.
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
