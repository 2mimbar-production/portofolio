import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import {
  ambilEpisode,
  ambilSemuaProgram,
  coverProgram,
  embedUrl,
  formatTanggal,
  galeriProgram,
  labelStatus,
  linkTonton,
  slugify,
  thumbnailYoutube,
} from "@/lib/program";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProgramHero from "@/components/ProgramHero";
import Galeri from "@/components/Galeri";
import KanalLinks from "@/components/KanalLinks";
import Muncul from "@/components/Muncul";

export const revalidate = 60;

async function ambilProgram(slug: string) {
  const semua = await ambilSemuaProgram();
  return semua.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const program = await ambilProgram(params.slug);
  if (!program) return {};
  const gambar = coverProgram(program);
  return {
    title: `${program.judul} | Etalase Program Duamimbar`,
    description: program.ringkasan ?? undefined,
    openGraph: gambar ? { images: [gambar] } : undefined,
  };
}

export default async function ProgramPage({ params }: { params: { slug: string } }) {
  const program = await ambilProgram(params.slug);
  if (!program) notFound();

  const episode = await ambilEpisode(program.slug);
  const foto = galeriProgram(program, episode);
  const tonton = linkTonton(program, episode);
  const trailer = embedUrl(program.video_url);
  const kanal = program.kanal ?? [];
  const genreSlug = slugify(program.kategori) || "lainnya";

  const info = [
    { label: "Genre", nilai: program.kategori },
    { label: "Status", nilai: labelStatus(program) },
    { label: "Jadwal tayang", nilai: program.jadwal_tayang },
    {
      label: "Episode",
      nilai: program.jumlah_episode
        ? `${program.jumlah_episode}${program.target_episode && program.target_episode < 500 ? ` dari ${program.target_episode}` : ""} tayang`
        : null,
    },
    { label: "Tayang terakhir", nilai: program.episode_terakhir ? formatTanggal(program.episode_terakhir) : null },
    { label: "Kerja sama", nilai: program.klien },
  ].filter((i) => i.nilai);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-8">
        <Link href={`/genre/${genreSlug}`} className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={15} /> {program.kategori}
        </Link>

        {/* 1. Program */}
        <div className="mt-6">
          <ProgramHero program={program} tonton={tonton} zoom />
        </div>

        {/* 2. Galeri */}
        {foto.length >= 2 && (
          <div className="mt-24">
            <Galeri foto={foto} judul={program.judul} />
          </div>
        )}

        {/* 3. Detail */}
        <section className="mt-24 grid gap-10 md:grid-cols-[1fr_260px]">
          <Muncul>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400">Tentang program</p>
            <div className="mt-4 whitespace-pre-line text-lg leading-relaxed text-white/80">
              {program.deskripsi || program.ringkasan || "Deskripsi program segera hadir."}
            </div>
            {trailer && (
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-ink-800">
                <iframe
                  src={trailer}
                  title={program.judul}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </Muncul>
          <Muncul jeda={120}>
            <dl className="space-y-4 rounded-2xl bg-ink-900 p-5 text-sm ring-1 ring-white/10">
              {info.map((i) => (
                <div key={i.label}>
                  <dt className="text-white/40">{i.label}</dt>
                  <dd className="mt-0.5 text-white">{i.nilai}</dd>
                </div>
              ))}
            </dl>
          </Muncul>
        </section>

        {episode.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-white/50">Episode terbaru</h2>
            <div className="-mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
              {episode.slice(0, 12).map((e, i) => {
                const thumb = thumbnailYoutube(e.link_tayang);
                const Tag = e.link_tayang ? "a" : "div";
                return (
                  <Tag
                    key={i}
                    {...(e.link_tayang ? { href: e.link_tayang, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group w-60 shrink-0 snap-start"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-800">
                      {thumb ? (
                        <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-sm text-white/30">{e.episode ?? "EP"}</div>
                      )}
                      {e.link_tayang && (
                        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-950">
                          <Play size={12} fill="currentColor" />
                        </span>
                      )}
                    </div>
                    {e.episode && <p className="mt-2 font-mono text-xs text-gold-400">{e.episode}</p>}
                    <p className="mt-0.5 line-clamp-2 text-sm text-white group-hover:text-gold-400">{e.judul}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {[formatTanggal(e.tanggal), e.platform].filter(Boolean).join(" · ")}
                    </p>
                  </Tag>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Link ke program */}
        {kanal.some((k) => k.link) && (
          <section className="mt-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-white/50">Tonton di</h2>
            <div className="mt-5">
              <KanalLinks kanal={kanal} besar />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
