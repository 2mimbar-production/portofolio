import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import {
  ambilEpisode,
  ambilSemuaProgram,
  coverProgram,
  embedUrl,
  formatTanggal,
  labelStatus,
  thumbnailYoutube,
} from "@/lib/program";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProgramCard from "@/components/ProgramCard";
import KanalLinks from "@/components/KanalLinks";

export const revalidate = 60;

async function ambilProgram(slug: string) {
  const semua = await ambilSemuaProgram();
  return { program: semua.find((p) => p.slug === slug) ?? null, semua };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { program } = await ambilProgram(params.slug);
  if (!program) return {};
  const gambar = coverProgram(program);
  return {
    title: `${program.judul} | Program Duamimbar`,
    description: program.ringkasan ?? undefined,
    openGraph: gambar ? { images: [gambar] } : undefined,
  };
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { program, semua } = await ambilProgram(params.slug);
  if (!program) notFound();

  const episode = await ambilEpisode(program.slug);
  const lain = semua.filter((p) => p.slug !== program.slug).slice(0, 3);
  // Video utama: trailer di karya, atau episode terbaru yang bisa di-embed.
  const embed = embedUrl(program.video_url) ?? embedUrl(episode.find((e) => embedUrl(e.link_tayang))?.link_tayang ?? null);
  const cover = coverProgram(program);
  const kanal = program.kanal ?? [];

  const info = [
    { label: "Status", nilai: labelStatus(program) },
    { label: "Jadwal tayang", nilai: program.jadwal_tayang },
    {
      label: "Episode",
      nilai: program.jumlah_episode
        ? `${program.jumlah_episode}${program.target_episode ? ` dari ${program.target_episode}` : ""} tayang`
        : program.target_episode
          ? `Target ${program.target_episode} episode`
          : null,
    },
    { label: "Tayang terakhir", nilai: program.episode_terakhir ? formatTanggal(program.episode_terakhir) : null },
    { label: "Kerja sama", nilai: program.klien },
    { label: "Tahun", nilai: program.tahun?.toString() },
  ].filter((i) => i.nilai);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <Link href="/#program" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-denim-700">
          <ArrowLeft size={15} /> Semua program
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold-500">{program.kategori}</p>
        <h1 className="mt-2 font-display text-3xl text-denim-900 sm:text-5xl">{program.judul}</h1>
        {program.ringkasan && <p className="mt-4 max-w-2xl text-lg text-muted">{program.ringkasan}</p>}
        {kanal.length > 0 && (
          <div className="mt-6">
            <KanalLinks kanal={kanal} />
          </div>
        )}

        {(embed || cover) && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-denim-900">
            {embed ? (
              <div className="aspect-video">
                <iframe
                  src={embed}
                  title={program.judul}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={cover!} alt={program.judul} className="w-full" />
            )}
          </div>
        )}

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_220px]">
          <div className="whitespace-pre-line leading-relaxed text-denim-900">
            {program.deskripsi || program.ringkasan || "Deskripsi program segera hadir."}
          </div>
          <dl className="space-y-4 text-sm">
            {info.map((i) => (
              <div key={i.label}>
                <dt className="text-muted">{i.label}</dt>
                <dd className="text-denim-900">{i.nilai}</dd>
              </div>
            ))}
            {program.link_url && (
              <a
                href={program.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-denim-500 hover:text-denim-700"
              >
                Kunjungi <ExternalLink size={13} />
              </a>
            )}
          </dl>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl text-denim-900">Episode</h2>
          {episode.length ? (
            <ol className="mt-6 divide-y divide-denim-100 rounded-2xl bg-white ring-1 ring-denim-100">
              {episode.map((e, i) => {
                const thumb = thumbnailYoutube(e.link_tayang);
                const isi = (
                  <>
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-denim-50 sm:w-36">
                      {thumb ? (
                        <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-xs text-denim-300">
                          {e.episode ?? "EP"}
                        </div>
                      )}
                      {e.link_tayang && (
                        <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-denim-900">
                          <Play size={11} fill="currentColor" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      {e.episode && <p className="font-mono text-xs text-gold-500">{e.episode}</p>}
                      <p className="font-medium text-denim-900 group-hover:text-denim-500">{e.judul}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {[formatTanggal(e.tanggal), e.platform].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </>
                );
                return (
                  <li key={i}>
                    {e.link_tayang ? (
                      <a
                        href={e.link_tayang}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-3 hover:bg-denim-50 sm:p-4"
                      >
                        {isi}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-3 sm:p-4">{isi}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-denim-100 py-10 text-center text-sm text-muted">
              Episode pertama segera tayang.
            </p>
          )}
        </section>

        {lain.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">Program lainnya</h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {lain.map((p) => (
                <ProgramCard key={p.slug} program={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
