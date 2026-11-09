import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ambilSemuaProgram, kelompokGenre, linkTonton } from "@/lib/program";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProgramHero from "@/components/ProgramHero";
import Muncul from "@/components/Muncul";

export const revalidate = 60;

async function ambilGenre(slug: string) {
  const semua = kelompokGenre(await ambilSemuaProgram());
  return { genre: semua.find((g) => g.slug === slug) ?? null, semua };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { genre } = await ambilGenre(params.slug);
  return genre ? { title: `${genre.nama} | Etalase Program Duamimbar` } : {};
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
  const { genre, semua } = await ambilGenre(params.slug);
  if (!genre) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-8">
        <Link href="/#genre" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={15} /> Semua genre
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400">Genre</p>
            <h1 className="mt-2 font-display text-4xl sm:text-6xl">{genre.nama}</h1>
          </div>
          <p className="font-mono text-sm text-white/50">{genre.program.length} program</p>
        </div>

        {semua.length > 1 && (
          <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {semua.map((g) => (
              <Link
                key={g.slug}
                href={`/genre/${g.slug}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${
                  g.slug === genre.slug ? "bg-white text-ink-950" : "bg-white/5 text-white/70 ring-1 ring-white/15 hover:text-white"
                }`}
              >
                {g.nama}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-10 space-y-8 sm:space-y-12">
          {genre.program.map((p, i) => (
            <Muncul key={p.slug}>
              <ProgramHero program={p} href={`/program/${p.slug}`} tonton={linkTonton(p)} zoom={i === 0} />
            </Muncul>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
