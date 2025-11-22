import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",           // writes the static site to ./out during build
  images: { unoptimized: true } // only needed if you use next/image
};

export default nextConfig;
