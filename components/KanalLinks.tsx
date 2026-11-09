import { ExternalLink } from "lucide-react";
import type { Kanal } from "@/lib/program";

/** Tombol ke tiap kanal tayang program (YouTube, Spotify, dst.). */
export default function KanalLinks({ kanal, gelap = false }: { kanal: Kanal[]; gelap?: boolean }) {
  const ada = kanal.filter((k) => k.platform);
  if (!ada.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {ada.map((k, i) => {
        const label = k.nama ? `${k.platform} · ${k.nama}` : k.platform;
        const kelas = gelap
          ? "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
          : "bg-white text-denim-700 ring-1 ring-denim-100 hover:ring-denim-300";
        return k.link ? (
          <a
            key={i}
            href={k.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${kelas}`}
          >
            {label} <ExternalLink size={13} />
          </a>
        ) : (
          <span key={i} className={`rounded-full px-3.5 py-1.5 text-sm ${kelas}`}>
            {label}
          </span>
        );
      })}
    </div>
  );
}
