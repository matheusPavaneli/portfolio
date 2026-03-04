/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
  // headers() não funciona com output: 'export' — GitHub Pages serve arquivos estáticos
};

export default nextConfig;
