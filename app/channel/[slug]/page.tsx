import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { ambilInsight, durasi, singkat } from "@/lib/insight";
import { formatTanggal } from "@/lib/program";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Statistik from "@/components/Statistik";
import TrenChart from "@/components/TrenChart";
import BarPersen from "@/components/BarPersen";
import Muncul from "@/components/Muncul";

export const revalidate = 60;

async function ambilChannel(slug: string) {
  const insight = await ambilInsight();
  return { channel: insight?.channel.find((c) => c.slug === slug) ?? null, insight };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { channel } = await ambilChannel(params.slug);
  return channel ? { title: `${channel.nama} | Etalase Program Duamimbar` } : {};
}

export default async function ChannelPage({ params }: { params: { slug: string } }) {
  const { channel: c } = await ambilChannel(params.slug);
  if (!c) notFound();
  const yt = c.platform === "YouTube";
  const naik = c.pengikut_naik_30h;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-8">
        <Link href="/#channel" className="inline-flex items-center gap-1.5 text-sm text-redup hover:text-navy">
          <ArrowLeft size={15} /> Semua channel
        </Link>

        <div className="zoom-masuk mt-6 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-langit-100 via-white to-pasir-50 p-6 ring-1 ring-navy/10 sm:p-10">
          <div className="flex items-center gap-4">
            {c.foto ? (
              <img src={c.foto} alt="" className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bata to-langit font-display text-2xl text-white">
                {c.nama.replace("@", "").slice(0, 1).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-bata">{c.platform}</p>
              <h1 className="mt-1 font-display text-3xl sm:text-5xl">{c.nama}</h1>
            </div>
          </div>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-bata px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-bata/30 transition hover:bg-bata-600"
          >
            Kunjungi channel <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="mt-8">
          <Statistik
            kolom="grid-cols-2 lg:grid-cols-3"
            data={[
              {
                label: yt ? "Subscriber" : "Followers",
                nilai: singkat(c.pengikut),
                catatan: naik ? `${naik > 0 ? "+" : ""}${singkat(naik)} dalam 30 hari` : null,
              },
              { label: yt ? "Views 30 hari" : "Reach 30 hari", nilai: singkat(c.views_30h) },
              { label: "Jam tonton 30 hari", nilai: singkat(c.jam_tonton_30h) },
              { label: "Rata-rata ditonton", nilai: c.rata_durasi_detik ? durasi(c.rata_durasi_detik) : "-" },
              { label: "Interaksi 30 hari", nilai: singkat(c.interaksi_30h), catatan: yt ? "like, komentar, share" : null },
              { label: "Total views", nilai: singkat(c.total_views) },
            ]}
          />
        </div>

        <Muncul className="mt-12">
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-redup">
            Pertumbuhan {yt ? "subscriber" : "followers"}
          </h2>
          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-navy/10 sm:p-6">
            <TrenChart data={c.tren} label={`Pertumbuhan ${c.nama}`} tinggi={200} />
          </div>
        </Muncul>

        {c.demografi && (c.demografi.usia.length > 0 || c.demografi.negara.length > 0) && (
          <Muncul className="mt-12">
            <h2 className="font-display text-2xl">Siapa penontonnya</h2>
            <p className="mt-1 text-sm text-redup">90 hari terakhir.</p>
            <div className="mt-6 grid gap-8 rounded-2xl bg-white p-5 ring-1 ring-navy/10 sm:p-8 md:grid-cols-3">
              <BarPersen judul="Usia" data={c.demografi.usia} />
              <BarPersen judul="Gender" data={c.demografi.gender} />
              <BarPersen judul="Negara" data={c.demografi.negara} />
            </div>
          </Muncul>
        )}

        {c.video_top && c.video_top.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl">Paling banyak ditonton</h2>
            <p className="mt-1 text-sm text-redup">90 hari terakhir.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.video_top.map((v, i) => (
                <Muncul key={v.url} jeda={i * 70}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-pasir-50">
                      <img src={v.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy">
                        <Play size={12} fill="currentColor" />
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-navy group-hover:text-bata">{v.judul}</p>
                    <p className="mt-0.5 font-mono text-xs text-redup">{singkat(v.views)} views</p>
                  </a>
                </Muncul>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 text-xs text-redup/70">
          Data diperbarui otomatis tiap hari. Terakhir {formatTanggal(c.diperbarui.slice(0, 10))}.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
