import Link from "next/link";
import type { Genre } from "@/lib/program";

// Geser naik-turun tiap panel supaya barisannya tidak kaku (seperti poster dijejer).
const GESER = ["md:mt-6", "md:mt-0", "md:mt-10", "md:mt-3", "md:mt-12", "md:mt-1", "md:mt-8", "md:mt-4"];
const WARNA = ["from-denim-700", "from-gold-500", "from-ink-700", "from-denim-500"];

/** Panel genre vertikal; panel yang disentuh/di-hover melebar. */
export default function GenreStrips({ genre }: { genre: Genre[] }) {
  return (
    <div
      className={`flex flex-col gap-2 md:flex-row md:items-start md:gap-3 ${
        genre.length <= 2 ? "h-[40vh] min-h-[260px]" : "h-[70vh] min-h-[420px] md:h-[64vh]"
      }`}
    >
      {genre.map((g, i) => (
        <Link
          key={g.slug}
          href={`/genre/${g.slug}`}
          className={`group relative min-h-0 flex-1 overflow-hidden rounded-xl bg-ink-800 transition-[flex-grow] duration-500 ease-out hover:flex-[3] focus-visible:flex-[3] md:h-[88%] md:min-w-0 ${GESER[i % GESER.length]}`}
        >
          {g.cover ? (
            <img
              src={g.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale-[40%] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-b ${WARNA[i % WARNA.length]} to-ink-900`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-ink-950/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
            <span className="font-display text-sm text-white drop-shadow sm:text-base md:text-lg">{g.nama}</span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/0 transition group-hover:text-gold-400">
              {g.program.length} program
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
