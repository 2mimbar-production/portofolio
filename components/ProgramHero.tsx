import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { type Program, coverProgram, labelStatus, sedangBerjalan } from "@/lib/program";

/**
 * Kartu besar program: gambar lebar, judul di atasnya, tombol Tonton.
 * `href` diisi kalau kartu mengarah ke halaman detail; `tonton` untuk tombol ke kanal.
 */
export default function ProgramHero({
  program,
  href,
  tonton,
  zoom = false,
}: {
  program: Program;
  href?: string;
  tonton?: string | null;
  zoom?: boolean;
}) {
  const cover = coverProgram(program);
  const isi = (
    <>
      {cover ? (
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-kobalt via-langit to-pasir" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
      {labelStatus(program) && (
        <div className="absolute inset-x-0 top-0 p-5 sm:p-8">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${
              sedangBerjalan(program) ? "bg-bata text-white" : "bg-white/85 text-navy backdrop-blur"
            }`}
          >
            {labelStatus(program)}
          </span>
        </div>
      )}
      <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-8 ${tonton ? "pb-20 sm:pb-8 sm:pr-40" : ""}`}>
        <p className="text-[11px] uppercase tracking-[0.25em] text-langit">{program.kategori}</p>
        <h2 className="mt-2 font-display text-3xl leading-tight text-white sm:text-5xl">{program.judul}</h2>
        {program.ringkasan && <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/70 sm:text-base">{program.ringkasan}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
          {href ? (
            <span className="inline-flex items-center gap-2 font-medium text-white">
              Lihat program <ArrowUpRight size={16} />
            </span>
          ) : null}
          {program.jumlah_episode > 0 && <span className="font-mono">{program.jumlah_episode} episode</span>}
          {program.jadwal_tayang && <span>{program.jadwal_tayang}</span>}
        </div>
      </div>
    </>
  );

  const kelas = `group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-pasir-100 shadow-xl shadow-navy/10 sm:aspect-[16/8] ${zoom ? "zoom-masuk" : ""}`;

  return (
    <div className="relative">
      {href ? (
        <Link href={href} className={kelas}>
          {isi}
        </Link>
      ) : (
        <div className={kelas}>{isi}</div>
      )}
      {tonton && (
        <a
          href={tonton}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-bata px-4 py-2 text-sm font-medium text-white shadow-lg shadow-navy/30 transition hover:bg-bata-600 sm:bottom-8 sm:left-auto sm:right-8 sm:px-5 sm:py-2.5"
        >
          <Play size={14} fill="currentColor" /> Tonton
        </a>
      )}
    </div>
  );
}
