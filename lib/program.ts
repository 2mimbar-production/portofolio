import { createPublicClient } from "./supabase";

export type Kanal = { platform: string; nama: string; link: string };

export type StatusProgram = "ide" | "praproduksi" | "produksi" | "pascaproduksi" | "selesai";

export type Program = {
  slug: string;
  judul: string;
  kategori: string;
  klien: string | null;
  tahun: number | null;
  ringkasan: string | null;
  deskripsi: string | null;
  cover_url: string | null;
  video_url: string | null;
  link_url: string | null;
  unggulan: boolean;
  urutan: number;
  status: StatusProgram;
  kanal: Kanal[] | null;
  jadwal_tayang: string | null;
  target_episode: number | null;
  jumlah_episode: number;
  episode_terakhir: string | null;
};

export type Episode = {
  episode: string | null;
  judul: string;
  tanggal: string;
  platform: string | null;
  link_tayang: string | null;
};

export async function ambilSemuaProgram(): Promise<Program[]> {
  const { data, error } = await createPublicClient().rpc("program_publik");
  if (error) {
    console.error("Gagal memuat program:", error.message);
    return [];
  }
  return ((data ?? []) as Program[]).sort(
    (a, b) =>
      a.urutan - b.urutan ||
      Number(b.unggulan) - Number(a.unggulan) ||
      (b.episode_terakhir ?? "").localeCompare(a.episode_terakhir ?? "") ||
      a.judul.localeCompare(b.judul)
  );
}

export async function ambilEpisode(slug: string): Promise<Episode[]> {
  const { data, error } = await createPublicClient().rpc("episode_publik", { p_slug: slug });
  if (error) {
    console.error("Gagal memuat episode:", error.message);
    return [];
  }
  return (data ?? []) as Episode[];
}

/** Program masih berjalan (tayang rutin) atau sudah tamat. */
export function labelStatus(p: Pick<Program, "status" | "jumlah_episode">) {
  if (p.status === "selesai") return "Tamat";
  if (p.jumlah_episode > 0) return "Sedang tayang";
  return "Segera tayang";
}

export function formatTanggal(iso: string | null, opsi: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "-";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("id-ID", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opsi,
  });
}

/** Ubah link YouTube/Vimeo jadi URL embed. Link lain dikembalikan null. */
export function embedUrl(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/live/"))
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean)[0]}`;
    if (host === "player.vimeo.com") return url;
  } catch {
    return null;
  }
  return null;
}

/** Thumbnail YouTube dari sebuah link, kalau ada. */
export function thumbnailYoutube(url: string | null) {
  const m = embedUrl(url)?.match(/youtube\.com\/embed\/([\w-]+)/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export function coverProgram(p: Pick<Program, "cover_url" | "video_url">) {
  return p.cover_url ?? thumbnailYoutube(p.video_url);
}
