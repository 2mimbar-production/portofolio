import Link from "next/link";
import { ambilSemuaProgram } from "@/lib/program";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProgramCard from "@/components/ProgramCard";
import ProgramGallery from "@/components/ProgramGallery";

export const revalidate = 60;

export default async function BerandaPage() {
  const program = await ambilSemuaProgram();
  const unggulan = program.filter((p) => p.unggulan).slice(0, 2);
  const totalEpisode = program.reduce((n, p) => n + p.jumlah_episode, 0);
  const totalKanal = new Set(program.flatMap((p) => (p.kanal ?? []).map((k) => `${k.platform}|${k.nama}`))).size;

  const angka = [
    { nilai: program.length, label: "program" },
    { nilai: totalEpisode, label: "episode tayang" },
    { nilai: totalKanal, label: "kanal" },
  ].filter((a) => a.nilai > 0);

  return (
    <>
      <section className="relative h-[88vh] min-h-[520px] overflow-hidden bg-denim-900">
        <SiteHeader overlay />
        {/* Background div, bukan <img>: Safari iPad tidak selalu meregangkan
            <img> absolute setinggi section, jadi gambarnya terpotong. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url(/hero-duamimbar.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-denim-900 via-denim-900/30 to-denim-900/50" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-24">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Portofolio Program</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-white sm:text-6xl">
            Program media Duamimbar yang tayang rutin.
          </h1>
          {angka.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {angka.map((a) => (
                <div key={a.label}>
                  <dt className="sr-only">{a.label}</dt>
                  <dd className="font-mono text-3xl font-semibold text-white">{a.nilai}</dd>
                  <dd className="text-xs uppercase tracking-[0.15em] text-white/60">{a.label}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link
            href="#program"
            className="mt-8 w-fit rounded-full bg-white px-5 py-2.5 text-sm font-medium text-denim-900 hover:bg-gold-400"
          >
            Lihat program
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {unggulan.length > 0 && (
          <section className="pt-20">
            <h2 className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">Program unggulan</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {unggulan.map((p) => (
                <ProgramCard key={p.slug} program={p} besar />
              ))}
            </div>
          </section>
        )}

        <section id="program" className="scroll-mt-8 pt-20">
          <h2 className="mb-6 font-display text-3xl text-denim-900">Semua program</h2>
          {program.length ? (
            <ProgramGallery program={program} />
          ) : (
            <p className="rounded-2xl border border-dashed border-denim-100 py-16 text-center text-sm text-muted">
              Portofolio program sedang disiapkan.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
