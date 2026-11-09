import Link from "next/link";
import { type Program, coverProgram, labelStatus } from "@/lib/program";

export default function ProgramCard({ program, besar = false }: { program: Program; besar?: boolean }) {
  const cover = coverProgram(program);
  const status = labelStatus(program);
  const platform = Array.from(new Set((program.kanal ?? []).map((k) => k.platform).filter(Boolean)));

  return (
    <Link href={`/program/${program.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl bg-denim-100 ${besar ? "aspect-[16/10]" : "aspect-video"}`}>
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-4xl text-denim-300">
            {program.judul.slice(0, 1)}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            status === "Sedang tayang" ? "bg-gold-400 text-denim-900" : "bg-white/90 text-denim-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className={`font-display text-denim-900 group-hover:text-denim-500 ${besar ? "text-xl" : "text-base"}`}>
          {program.judul}
        </h3>
        {program.jumlah_episode > 0 && (
          <span className="shrink-0 font-mono text-xs text-muted">{program.jumlah_episode} episode</span>
        )}
      </div>
      <p className="mt-0.5 text-sm text-muted">
        {[program.kategori, ...platform].join(" · ")}
      </p>
      {besar && program.ringkasan && <p className="mt-2 line-clamp-2 text-sm text-denim-700">{program.ringkasan}</p>}
    </Link>
  );
}
