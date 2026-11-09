"use client";

import { useMemo, useRef, useState } from "react";
import { singkat } from "@/lib/insight";

/** Grafik garis satu seri (mis. jumlah pengikut per hari) dengan crosshair + tooltip. */
export default function TrenChart({
  data,
  label,
  tinggi = 160,
  mini = false,
}: {
  data: { tanggal: string; nilai: number | null }[];
  label: string;
  tinggi?: number;
  mini?: boolean;
}) {
  const titik = useMemo(() => data.filter((d) => d.nilai !== null) as { tanggal: string; nilai: number }[], [data]);
  const ref = useRef<SVGSVGElement>(null);
  const [aktif, setAktif] = useState<number | null>(null);
  const L = 600;
  const H = tinggi;
  const pad = mini ? 4 : 12;

  if (titik.length < 2) {
    return mini ? null : (
      <p className="rounded-xl bg-ink-900 p-6 text-center text-sm text-white/40">
        Grafik muncul setelah data terkumpul beberapa hari.
      </p>
    );
  }

  const nilai = titik.map((t) => t.nilai);
  const min = Math.min(...nilai);
  const max = Math.max(...nilai);
  const rentang = max - min || 1;
  const x = (i: number) => pad + (i / (titik.length - 1)) * (L - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / rentang) * (H - pad * 2);
  const garis = titik.map((t, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(t.nilai).toFixed(1)}`).join(" ");
  const area = `${garis} L${x(titik.length - 1)},${H} L${x(0)},${H} Z`;

  function gerak(e: React.PointerEvent<SVGSVGElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const rel = ((e.clientX - r.left) / r.width) * L;
    const i = Math.round(((rel - pad) / (L - pad * 2)) * (titik.length - 1));
    setAktif(Math.max(0, Math.min(titik.length - 1, i)));
  }

  const a = aktif !== null ? titik[aktif] : null;

  return (
    <figure className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${L} ${H}`}
        preserveAspectRatio="none"
        className="block h-full w-full touch-none"
        style={{ height: mini ? 48 : H }}
        role="img"
        aria-label={`${label}: dari ${singkat(titik[0].nilai)} menjadi ${singkat(titik[titik.length - 1].nilai)}`}
        onPointerMove={mini ? undefined : gerak}
        onPointerDown={mini ? undefined : gerak}
        onPointerLeave={() => setAktif(null)}
      >
        <defs>
          <linearGradient id="isi-tren" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#D9A566" stopOpacity="0.25" />
            <stop offset="1" stopColor="#D9A566" stopOpacity="0" />
          </linearGradient>
        </defs>
        {!mini && <line x1={0} x2={L} y1={H - pad} y2={H - pad} stroke="rgba(255,255,255,0.1)" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
        <path d={area} fill="url(#isi-tren)" />
        <path d={garis} fill="none" stroke="#D9A566" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {a && aktif !== null && (
          <line x1={x(aktif)} x2={x(aktif)} y1={0} y2={H} stroke="rgba(255,255,255,0.35)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {a && aktif !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-700 px-2.5 py-1.5 text-xs shadow-lg ring-1 ring-white/10"
          style={{ left: `${(x(aktif) / L) * 100}%` }}
        >
          <span className="block font-mono font-semibold text-white">{a.nilai.toLocaleString("id-ID")}</span>
          <span className="block text-white/50">{a.tanggal}</span>
        </div>
      )}
      {!mini && (
        <figcaption className="mt-2 flex justify-between text-[11px] text-white/40">
          <span>{titik[0].tanggal}</span>
          <span>{titik[titik.length - 1].tanggal}</span>
        </figcaption>
      )}
    </figure>
  );
}
