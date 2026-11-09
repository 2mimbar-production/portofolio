import Link from "next/link";
import { type Channel, singkat } from "@/lib/insight";
import TrenChart from "./TrenChart";

export default function ChannelCard({ channel }: { channel: Channel }) {
  const naik = channel.pengikut_naik_30h;
  return (
    <Link
      href={`/channel/${channel.slug}`}
      className="group flex h-full flex-col rounded-2xl bg-ink-900 p-5 ring-1 ring-white/10 transition hover:bg-ink-800 hover:ring-gold-400/40"
    >
      <div className="flex items-center gap-3">
        {channel.foto ? (
          <img src={channel.foto} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-denim-500 font-display text-ink-950">
            {channel.nama.replace("@", "").slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-white group-hover:text-gold-400">{channel.nama}</p>
          <p className="text-xs text-white/50">{channel.platform}</p>
        </div>
      </div>
      <p className="mt-5 font-mono text-3xl font-semibold text-white">{singkat(channel.pengikut)}</p>
      <p className="text-xs text-white/50">
        {channel.platform === "YouTube" ? "subscriber" : "followers"}
        {naik ? <span className="ml-2 text-gold-400">{naik > 0 ? "+" : ""}{singkat(naik)} / 30 hari</span> : null}
      </p>
      <div className="mt-4">
        <TrenChart data={channel.tren} label={`Tren ${channel.nama}`} mini />
      </div>
      <dl className="mt-auto grid grid-cols-2 gap-3 pt-4 text-xs">
        {channel.views_30h ? (
          <div>
            <dt className="text-white/40">{channel.platform === "YouTube" ? "Views 30 hari" : "Reach 30 hari"}</dt>
            <dd className="font-mono text-sm text-white">{singkat(channel.views_30h)}</dd>
          </div>
        ) : null}
        {channel.jam_tonton_30h ? (
          <div>
            <dt className="text-white/40">Jam tonton 30 hari</dt>
            <dd className="font-mono text-sm text-white">{singkat(channel.jam_tonton_30h)}</dd>
          </div>
        ) : channel.interaksi_30h ? (
          <div>
            <dt className="text-white/40">Interaksi 30 hari</dt>
            <dd className="font-mono text-sm text-white">{singkat(channel.interaksi_30h)}</dd>
          </div>
        ) : null}
      </dl>
    </Link>
  );
}
