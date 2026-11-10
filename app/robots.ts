import type { MetadataRoute } from "next";

const SITUS = process.env.NEXT_PUBLIC_SITE_URL || "https://2mimbar-portofolio.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITUS}/sitemap.xml` };
}
