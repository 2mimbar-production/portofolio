import Link from "next/link";
import { ambilSemuaProgram, coverProgram, kelompokGenre, labelStatus } from "@/lib/program";
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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-8">
        <section id="genre" className="scroll-mt-4 pt-6 sm:pt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400">Etalase program</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight sm:text-5xl">
            Yang sedang Duamimbar kerjakan.
          </h1>
          <p className="mt-3 text-sm text-white/50">Pilih genre untuk melihat programnya.</p>

          <div className="mt-8">
            {genre.length ? (
              <GenreStrips genre={genre} />
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 py-24 text-center text-sm text-white/50">
                Etalase program sedang disiapkan.
              </p>
            )}
          </div>
        </section>

        {insight && <ChannelSection insight={insight} />}

        {program.length > 0 && (
          <section className="pt-20">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/50">Semua program</h2>
            <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
              {program.map((p, i) => {
                const cover = coverProgram(p);
                return (
                  <Muncul key={p.slug} jeda={i * 60} className="w-40 shrink-0 snap-start sm:w-auto">
                    <Link href={`/program/${p.slug}`} className="group block">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-800">
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-b from-denim-700 to-ink-900" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
                        <p className="absolute inset-x-0 bottom-0 p-3 font-display text-sm leading-snug">{p.judul}</p>
                      </div>
                      <p className="mt-2 text-xs text-white/50">
                        {p.kategori} · {labelStatus(p)}
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
