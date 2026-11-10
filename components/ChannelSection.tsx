import { type Insight, jangkauan, singkat } from "@/lib/insight";
import { formatTanggal } from "@/lib/program";
import ChannelCard from "./ChannelCard";
import Statistik from "./Statistik";
import Muncul from "./Muncul";

/** Bagian "Channel yang kami kelola" di beranda. */
export default function ChannelSection({ insight }: { insight: Insight }) {
  if (!insight.channel.length) return null;
  const j = jangkauan(insight.channel);
  return (
    <section id="channel" className="scroll-mt-4 pt-20">
      <p className="text-[11px] uppercase tracking-[0.3em] text-bata">Jangkauan</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">Channel yang kami kelola</h2>
      <p className="mt-2 text-sm text-redup">
        Diperbarui otomatis. Data per {formatTanggal(insight.diperbarui.slice(0, 10))}.
      </p>
      <div className="mt-8">
        <Statistik
          data={[
            { label: "Total audiens", nilai: singkat(j.audiens) },
            { label: "Views & reach 30 hari", nilai: singkat(j.views30) },
            { label: "Jam tonton 30 hari", nilai: singkat(j.jamTonton30) },
            { label: "Interaksi 30 hari", nilai: singkat(j.interaksi30) },
          ]}
        />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insight.channel.map((c, i) => (
          <Muncul key={c.slug} jeda={i * 80}>
            <ChannelCard channel={c} />
          </Muncul>
        ))}
      </div>
    </section>
  );
}
