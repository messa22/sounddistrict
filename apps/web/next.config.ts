import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/sounddistrict" : "";

const nextConfig: NextConfig = {
  transpilePackages: ["@sounddistrict/booking-core"],
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: isGitHubPages },
  trailingSlash: isGitHubPages,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  }
};

export default nextConfig;
