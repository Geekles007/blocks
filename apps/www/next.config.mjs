/**
 * Static export so blocks.ibird.dev can be hosted on any static host (the same
 * FTP pipeline as ui.ibird.dev). Set `BASE_PATH=/<repo>` for a GitHub project
 * page; leave empty for local dev and the custom domain.
 */
const basePath = process.env.BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
