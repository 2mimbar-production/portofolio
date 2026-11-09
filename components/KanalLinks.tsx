import { ArrowUpRight } from "lucide-react";
import type { Kanal } from "@/lib/program";

/** Tombol ke tiap kanal tayang program (YouTube, Spotify, dst.). */
export default function KanalLinks({ kanal, besar = false }: { kanal: Kanal[]; besar?: boolean }) {
  const ada = kanal.filter((k) => k.platform && k.link);
  if (!ada.length) return null;
  return (
    <div className={besar ? "grid gap-3 sm:grid-cols-2" : "flex flex-wrap gap-2"}>
      {ada.map((k, i) => (
        <a
          key={i}
          href={k.link}
          target="_blank"
          rel="noopener noreferrer"
          className={
            besar
              ? "group flex items-center justify-between rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10 transition hover:bg-ink-700 hover:ring-gold-400/50"
              : "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/20"
          }
        >
          {besar ? (
            <>
              <span>
                <span className="block text-xs uppercase tracking-[0.2em] text-white/50">{k.platform}</span>
                <span className="mt-1 block font-display text-lg text-white">{k.nama || "Kunjungi kanal"}</span>
              </span>
              <ArrowUpRight className="text-white/50 transition group-hover:text-gold-400" />
            </>
          ) : (
            <>
              {k.platform} <ArrowUpRight size={13} />
            </>
          )}
        </a>
      ))}
    </div>
  );
}
