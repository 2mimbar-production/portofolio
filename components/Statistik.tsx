/** Deretan angka besar (stat tile). */
export default function Statistik({
  data,
  kolom = "grid-cols-2 sm:grid-cols-4",
}: {
  data: { label: string; nilai: string; catatan?: string | null }[];
  kolom?: string;
}) {
  const ada = data.filter((d) => d.nilai && d.nilai !== "-" && d.nilai !== "0");
  if (!ada.length) return null;
  return (
    <dl className={`grid gap-px overflow-hidden rounded-2xl bg-navy/10 ${kolom}`}>
      {ada.map((d) => (
        <div key={d.label} className="bg-white p-4 sm:p-5">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-redup">{d.label}</dt>
          <dd className="mt-2 font-mono text-2xl font-semibold text-navy sm:text-3xl">{d.nilai}</dd>
          {d.catatan && <dd className="mt-1 text-xs text-bata">{d.catatan}</dd>}
        </div>
      ))}
    </dl>
  );
}
