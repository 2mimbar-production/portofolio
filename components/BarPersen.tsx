import type { LabelPersen } from "@/lib/insight";

/** Bar horizontal persen, nilai ditulis langsung di tiap baris. */
export default function BarPersen({ judul, data }: { judul: string; data: LabelPersen[] }) {
  // "65-" dari YouTube Analytics berarti 65 tahun ke atas.
  const ada = data
    .filter((d) => d.persen !== null && d.persen > 0)
    .map((d) => ({ ...d, label: d.label.replace(/^(\d+)-$/, "$1+").replace("-", "–") }));
  if (!ada.length) return null;
  const max = Math.max(...ada.map((d) => d.persen ?? 0));
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/50">{judul}</h3>
      <ul className="mt-4 space-y-3">
        {ada.map((d) => (
          <li key={d.label} className="grid grid-cols-[84px_1fr_48px] items-center gap-3 text-sm">
            <span className="truncate text-white/70">{d.label}</span>
            <span className="h-2 rounded-full bg-white/5">
              <span
                className="block h-2 rounded-full bg-gold-400 transition-[width] duration-700"
                style={{ width: `${((d.persen ?? 0) / max) * 100}%` }}
              />
            </span>
            <span className="text-right font-mono text-white">{d.persen?.toLocaleString("id-ID")}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
