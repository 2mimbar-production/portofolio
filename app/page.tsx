import Link from "next/link";
import { ambilSemuaProgram, coverProgram, kelompokGenre, labelStatus, linkTonton, sedangBerjalan } from "@/lib/program";
import ProgramHero from "@/components/ProgramHero";
import BidangWarna from "@/components/BidangWarna";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GenreStrips from "@/components/GenreStrips";
import Muncul from "@/components/Muncul";
import ChannelSection from "@/components/ChannelSection";
import { ambilInsight } from "@/lib/insight";

export const revalidate = 60;

export default async function BerandaPage() {
  const [program, insight] = await Promise.all([ambilSemuaProgram(), ambilInsight()]);
  const genre = kelompokGenre(program);
  const berjalan = program.filter(sedangBerjalan);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-8">
        <section id="genre" className="scroll-mt-4 pt-6 sm:pt-10">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-bata-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-bata">
                Etalase program
              </p>
              <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] sm:text-6xl">
                Yang sedang <span className="text-bata">Duamimbar</span> kerjakan.
              </h1>
              <p className="mt-4 max-w-md text-redup">
                Podcast, monolog, dan konten kajian yang kami produksi dan tayangkan rutin. Pilih genre untuk melihat
                programnya.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#program-genre"
                  className="rounded-full bg-bata px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-bata/30 transition hover:bg-bata-600"
                >
                  Lihat program
                </a>
                <a
                  href="#kontak"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-navy ring-1 ring-navy/15 transition hover:ring-navy/40"
                >
                  Kerja sama
                </a>
              </div>
            </div>
            <BidangWarna />
          </div>

          <div id="program-genre" className="mt-14 scroll-mt-6">
            {genre.length ? (
              <GenreStrips genre={genre} />
            ) : (
              <p className="rounded-2xl border border-dashed border-navy/10 py-24 text-center text-sm text-redup">
                Etalase program sedang disiapkan.
              </p>
            )}
          </div>
        </section>

        {berjalan.length > 0 && (
          <section id="berjalan" className="scroll-mt-4 pt-20">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bata">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bata opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-bata" />
              </span>
              On going
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Sedang berjalan</h2>
            <div className={`mt-8 grid gap-6 ${berjalan.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {berjalan.map((p) => (
                <Muncul key={p.slug}>
                  <ProgramHero program={p} href={`/program/${p.slug}`} tonton={linkTonton(p)} />
                </Muncul>
              ))}
            </div>
          </section>
        )}

        {insight && <ChannelSection insight={insight} />}

        {program.length > 0 && (
          <section className="pt-20">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-redup">Semua program</h2>
            <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
              {program.map((p, i) => {
                const cover = coverProgram(p);
                return (
                  <Muncul key={p.slug} jeda={i * 60} className="w-40 shrink-0 snap-start sm:w-auto">
                    <Link href={`/program/${p.slug}`} className="group block">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-pasir-50">
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-b from-kobalt to-langit" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                        <p className="absolute inset-x-0 bottom-0 p-3 font-display text-sm leading-snug text-white">{p.judul}</p>
                      </div>
                      <p className="mt-2 text-xs text-redup">
                        {[p.kategori, labelStatus(p)].filter(Boolean).join(" · ")}
                      </p>
                    </Link>
                  </Muncul>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
