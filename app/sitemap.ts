import type { MetadataRoute } from "next";
import { ambilSemuaProgram, kelompokGenre } from "@/lib/program";
import { ambilInsight } from "@/lib/insight";

const SITUS = process.env.NEXT_PUBLIC_SITE_URL || "https://2mimbar-portofolio.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [program, insight] = await Promise.all([ambilSemuaProgram(), ambilInsight()]);
  return [
    { url: SITUS, changeFrequency: "daily", priority: 1 },
    ...kelompokGenre(program).map((g) => ({ url: `${SITUS}/genre/${g.slug}`, changeFrequency: "weekly" as const })),
    ...program.map((p) => ({ url: `${SITUS}/program/${p.slug}`, changeFrequency: "weekly" as const })),
    ...(insight?.channel ?? []).map((c) => ({ url: `${SITUS}/channel/${c.slug}`, changeFrequency: "daily" as const })),
  ];
}
