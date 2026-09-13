import type { NextConfig } from "next";

const repoBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repoBasePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;