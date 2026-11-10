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
  kelompokKru,
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
import Statistik from "@/components/Statistik";
import { ambilInsight, singkat } from "@/lib/insight";

export const revalidate = 60;

function kanalPlatform(kanal: { platform: string }[] | null) {
  return (kanal ?? []).map((k) => k.platform).filter(Boolean);
}

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

  const [episode, insight] = await Promise.all([ambilEpisode(program.slug), ambilInsight()]);
  const angka = insight?.program.find((p) => p.slug === program.slug) ?? null;
  const platform = Array.from(new Set(kanalPlatform(program.kanal)));
  const limaW = [
    { kunci: "What", judul: "Tentang apa", isi: program.apa ?? program.ringkasan },
    { kunci: "Why", judul: "Kenapa dibuat", isi: program.mengapa },
    { kunci: "Who", judul: "Untuk & bersama siapa", isi: program.siapa },
    { kunci: "When", judul: "Kapan tayang", isi: program.jadwal_tayang ?? (program.tahun ? `Sejak ${program.tahun}` : null) },
    { kunci: "Where", judul: "Tayang di", isi: platform.length ? platform.join(", ") : null },
    { kunci: "How", judul: "Formatnya", isi: program.bagaimana },
    {
      kunci: "How much",
      judul: "Seberapa banyak",
      isi:
        angka?.episode || program.jumlah_episode
          ? `${angka?.episode ?? program.jumlah_episode} episode${program.target_episode && program.target_episode < 500 ? ` dari target ${program.target_episode}` : ""}`
          : program.target_episode && program.target_episode < 500
            ? `Target ${program.target_episode} episode`
            : null,
    },
  ].filter((x) => x.isi);
  const foto = galeriProgram(program, episode);
  const tonton = linkTonton(program, episode);
  const trailer = embedUrl(program.video_url);
  const kanal = program.kanal ?? [];
  const genreSlug = slugify(program.kategori) || "lainnya";
  const kru = kelompokKru(program.kru);

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
        <Link href={`/genre/${genreSlug}`} className="inline-flex items-center gap-1.5 text-sm text-redup hover:text-navy">
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

        {/* Insight angka dari YouTube (spreadsheet) */}
        {angka && (
          <section className="mt-24">
            <p className="text-[11px] uppercase tracking-[0.3em] text-bata">Insight</p>
            <h2 className="mt-2 font-display text-3xl">Performa program</h2>
            <div className="mt-6">
              <Statistik
                data={[
                  { label: "Total views", nilai: singkat(angka.total_views) },
                  { label: "Rata-rata per episode", nilai: singkat(angka.rata_views) },
                  { label: "Jam tonton", nilai: singkat(angka.jam_tonton) },
                  { label: "Like", nilai: singkat(angka.like) },
                ]}
              />
            </div>
            {angka.top && (
              <a
                href={angka.top.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-navy/10 hover:ring-bata/40"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-redup">Episode terpopuler</span>
                  <span className="mt-1 block truncate text-navy">{angka.top.judul}</span>
                </span>
                <span className="shrink-0 font-mono text-sm text-bata">{singkat(angka.top.views)} views</span>
              </a>
            )}
          </section>
        )}

        {/* 5W2H */}
        {limaW.length >= 3 && (
          <section className="mt-24">
            <p className="text-[11px] uppercase tracking-[0.3em] text-bata">5W2H</p>
            <h2 className="mt-2 font-display text-3xl">Program ini dalam satu layar</h2>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-navy/10 sm:grid-cols-2 lg:grid-cols-4">
              {limaW.map((w, i) => (
                <Muncul key={w.kunci} jeda={i * 60} className="bg-white p-5">
                  <p className="font-mono text-xs text-bata">{w.kunci}</p>
                  <p className="mt-1 text-xs text-redup">{w.judul}</p>
                  <p className="mt-3 whitespace-pre-line text-navy/80">{w.isi}</p>
                </Muncul>
              ))}
            </div>
          </section>
        )}

        {/* 3. Detail */}
        <section className="mt-24 grid gap-10 md:grid-cols-[1fr_260px]">
          <Muncul>
            <p className="text-[11px] uppercase tracking-[0.3em] text-bata">Tentang program</p>
            <div className="mt-4 whitespace-pre-line text-lg leading-relaxed text-navy/80">
              {program.deskripsi || program.ringkasan || "Deskripsi program segera hadir."}
            </div>
            {trailer && (
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-pasir-50">
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
            <dl className="space-y-4 rounded-2xl bg-white p-5 text-sm ring-1 ring-navy/10">
              {info.map((i) => (
                <div key={i.label}>
                  <dt className="text-redup">{i.label}</dt>
                  <dd className="mt-0.5 text-navy">{i.nilai}</dd>
                </div>
              ))}
            </dl>
          </Muncul>
        </section>

        {episode.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-redup">Episode terbaru</h2>
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
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-pasir-50">
                      {thumb ? (
                        <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-sm text-redup/70">{e.episode ?? "EP"}</div>
                      )}
                      {e.link_tayang && (
                        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy">
                          <Play size={12} fill="currentColor" />
                        </span>
                      )}
                    </div>
                    {e.episode && <p className="mt-2 font-mono text-xs text-bata">{e.episode}</p>}
                    <p className="mt-0.5 line-clamp-2 text-sm text-navy group-hover:text-bata">{e.judul}</p>
                    <p className="mt-0.5 text-xs text-redup">
                      {[formatTanggal(e.tanggal), e.platform].filter(Boolean).join(" · ")}
                    </p>
                  </Tag>
                );
              })}
            </div>
          </section>
        )}

        {/* Kru / credit */}
        {kru.utama.length + kru.hormat.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-bata">Di balik layar</p>
            <h2 className="mt-2 font-display text-3xl">Kru</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {kru.utama.map((k, i) => (
                <Muncul key={`${k.nama}-${i}`} jeda={i * 40} className="border-l-2 border-bata/70 pl-4">
                  <dt className="text-xs uppercase tracking-[0.15em] text-redup">{k.peran || "Kru"}</dt>
                  <dd className="mt-1 font-display text-lg text-navy">{k.nama}</dd>
                </Muncul>
              ))}
            </dl>
            {kru.hormat.length > 0 && (
              <div className="mt-10">
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-redup">Honorable mention</h3>
                <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {kru.hormat.map((k, i) => (
                    <div key={`${k.nama}-${i}`} className="border-l-2 border-navy/10 pl-4">
                      <dt className="text-xs uppercase tracking-[0.15em] text-redup">{k.peran || "Kru"}</dt>
                      <dd className="mt-1 text-navy/80">{k.nama}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}

        {/* 4. Link ke program */}
        {kanal.some((k) => k.link) && (
          <section className="mt-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-redup">Tonton di</h2>
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
