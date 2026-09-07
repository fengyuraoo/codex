const isGitHubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.LOCAL_BUILD_CPUS ? { experimental: { cpus: Number(process.env.LOCAL_BUILD_CPUS) } } : {}),
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  ...(isGitHubPages
    ? {
        basePath: "/codex",
        assetPrefix: "/codex/"
      }
    : {})
};

export default nextConfig;
