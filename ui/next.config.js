const isProd = process.env.GHPAGES === 'true';


/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? '/virtualhome2kg_generation' : '',
  reactStrictMode: true,
}

module.exports = nextConfig
