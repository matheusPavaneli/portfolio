import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN ?? "https://matheusPavaneli.github.io";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${ORIGIN}${BASE}/sitemap.xml`,
  };
}
