/**
 * Insight channel & program dari spreadsheet (lewat Apps Script doGet).
 * INSIGHT_URL hanya ada di server (bukan NEXT_PUBLIC), berisi alamat web app
 * lengkap dengan ?kunci=..., jadi kuncinya tidak pernah sampai ke browser.
 */

export type LabelPersen = { label: string; persen: number | null };

export type Channel = {
  platform: "YouTube" | "Instagram";
  slug: string;
  nama: string;
  url: string;
  foto: string | null;
  pengikut: number | null;
  pengikut_naik_30h: number | null;
  total_views?: number | null;
  jumlah_video?: number | null;
  views_30h: number | null;
  jam_tonton_30h?: number | null;
  rata_durasi_detik?: number | null;
  interaksi_30h: number | null;
  tren: { tanggal: string; nilai: number | null }[];
  demografi?: { usia: LabelPersen[]; gender: LabelPersen[]; negara: LabelPersen[] };
  video_top?: { judul: string; url: string; thumbnail: string; views: number | null }[];
  diperbarui: string;
};

export type InsightProgram = {
  slug: string;
  episode: number | null;
  total_views: number | null;
  rata_views: number | null;
  jam_tonton: number | null;
  like: number | null;
  top: { judul: string; url: string; views: number | null } | null;
};

export type Insight = { diperbarui: string; channel: Channel[]; program: InsightProgram[] };

export async function ambilInsight(): Promise<Insight | null> {
  const url = process.env.INSIGHT_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data as Insight;
  } catch (e) {
    console.error("Gagal memuat insight:", (e as Error).message);
    return null;
  }
}

/** 512000 -> "512 rb", 1250000 -> "1,3 jt". */
export function singkat(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  const abs = Math.abs(n);
  const fmt = (x: number) => x.toLocaleString("id-ID", { maximumFractionDigits: x < 10 ? 1 : 0 });
  if (abs >= 1e9) return `${fmt(n / 1e9)} M`;
  if (abs >= 1e6) return `${fmt(n / 1e6)} jt`;
  if (abs >= 1e4) return `${fmt(n / 1e3)} rb`;
  return n.toLocaleString("id-ID");
}

export function durasi(detik: number | null | undefined) {
  if (!detik) return "-";
  const m = Math.floor(detik / 60);
  const s = detik % 60;
  return m ? `${m} mnt ${s} dtk` : `${s} dtk`;
}

/** Ringkasan gabungan semua channel untuk strip angka di beranda. */
export function jangkauan(channel: Channel[]) {
  const jumlah = (f: (c: Channel) => number | null | undefined) =>
    channel.reduce((a, c) => a + (f(c) ?? 0), 0);
  return {
    audiens: jumlah((c) => c.pengikut),
    views30: jumlah((c) => c.views_30h),
    jamTonton30: jumlah((c) => c.jam_tonton_30h),
    interaksi30: jumlah((c) => c.interaksi_30h),
  };
}
