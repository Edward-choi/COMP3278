const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  trailingSlash: false,
};

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
