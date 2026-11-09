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
  /** null = karya tanpa program terhubung (dianggap sudah tamat). */
  status: StatusProgram | null;
  kanal: Kanal[] | null;
  jadwal_tayang: string | null;
  target_episode: number | null;
  jumlah_episode: number;
  episode_terakhir: string | null;
  /** 5W2H (diisi di Studio). */
  apa?: string | null;
  mengapa?: string | null;
  siapa?: string | null;
  bagaimana?: string | null;
};

export type Episode = {
  episode: string | null;
  judul: string;
  tanggal: string;
  platform: string | null;
  link_tayang: string | null;
};

export async function ambilSemuaProgram(): Promise<Program[]> {
  const supabase = createPublicClient();
  // 5W2H dibaca langsung dari tabel karya (RLS: publik boleh baca karya terbit).
  const [{ data, error }, { data: limaW }] = await Promise.all([
    supabase.rpc("program_publik"),
    supabase.from("karya").select("slug, apa, mengapa, siapa, bagaimana").eq("terbit", true),
  ]);
  if (error) {
    console.error("Gagal memuat program:", error.message);
    return [];
  }
  const peta = new Map((limaW ?? []).map((k) => [k.slug as string, k]));
  return ((data ?? []) as Program[]).map((p) => ({ ...p, ...peta.get(p.slug) })).sort(
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
  if (!p.status || p.status === "selesai") return "Tamat";
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

export function slugify(teks: string) {
  return teks
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Genre = { slug: string; nama: string; program: Program[]; cover: string | null };

/** Kelompokkan program per genre (kategori karya), urut dari yang programnya terbanyak. */
export function kelompokGenre(program: Program[]): Genre[] {
  const peta = new Map<string, Genre>();
  for (const p of program) {
    const slug = slugify(p.kategori) || "lainnya";
    const g = peta.get(slug) ?? { slug, nama: p.kategori, program: [], cover: null };
    g.program.push(p);
    g.cover ??= coverProgram(p);
    peta.set(slug, g);
  }
  return Array.from(peta.values()).sort((a, b) => b.program.length - a.program.length);
}

/** Foto galeri: cover program lalu thumbnail episode yang punya link YouTube. */
export function galeriProgram(p: Pick<Program, "cover_url" | "video_url">, episode: Episode[], maks = 7) {
  const semua = [coverProgram(p), ...episode.map((e) => thumbnailYoutube(e.link_tayang))];
  return Array.from(new Set(semua.filter((x): x is string => Boolean(x)))).slice(0, maks);
}

/** Link utama tombol "Tonton": trailer, episode terbaru, lalu kanal pertama. */
export function linkTonton(p: Pick<Program, "video_url" | "link_url" | "kanal">, episode: Episode[] = []) {
  return (
    p.video_url ??
    episode.find((e) => e.link_tayang)?.link_tayang ??
    (p.kanal ?? []).find((k) => k.link)?.link ??
    p.link_url ??
    null
  );
}
