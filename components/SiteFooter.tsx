import { Mail, MessageCircle, Instagram } from "lucide-react";

// Kontak kerja sama, diisi lewat env var di Vercel:
//   NEXT_PUBLIC_KONTAK_EMAIL, NEXT_PUBLIC_KONTAK_WA (format 62xxx),
//   NEXT_PUBLIC_KONTAK_WA_NAMA (nama & jabatan CP), NEXT_PUBLIC_KONTAK_IG.
const EMAIL = process.env.NEXT_PUBLIC_KONTAK_EMAIL;
const WA = process.env.NEXT_PUBLIC_KONTAK_WA;
const WA_NAMA = process.env.NEXT_PUBLIC_KONTAK_WA_NAMA;
const IG = process.env.NEXT_PUBLIC_KONTAK_IG || "media2mimbar";

/** 6285162902332 -> 0851-6290-2332 */
function nomorLokal(wa: string) {
  const lokal = wa.replace(/^62/, "0");
  return lokal.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}

const PESAN_WA = encodeURIComponent("Halo Duamimbar, saya tertarik bekerja sama / mensponsori program Anda.");
const SUBJEK_EMAIL = encodeURIComponent("Kerja sama program Duamimbar");

export default function SiteFooter() {
  const sapaan = WA_NAMA?.split("·")[0]?.trim();
  return (
    <footer id="kontak" className="mt-24 scroll-mt-4 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-langit">Kerja sama &amp; sponsor</p>
          <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Punya brand yang cocok dengan program kami?</p>
          <p className="mt-4 max-w-md text-sm text-white/70">
            Duamimbar memproduksi program podcast, monolog, dan konten kajian yang tayang rutin dengan audiens keluarga
            muda. Yuk, ngobrol dulu.
          </p>
        </div>

        <div className="space-y-3">
          {WA && (
            <a
              href={`https://wa.me/${WA}?text=${PESAN_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-bata p-4 transition hover:bg-bata-600"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MessageCircle size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-white/80">WhatsApp{WA_NAMA ? ` · ${WA_NAMA}` : ""}</span>
                <span className="block font-display text-lg">{nomorLokal(WA)}</span>
              </span>
              <span className="ml-auto hidden text-sm text-white/90 sm:block">
                Chat {sapaan || "kami"} →
              </span>
            </a>
          )}
          {EMAIL && (
            <a
              href={`mailto:${EMAIL}?subject=${SUBJEK_EMAIL}`}
              className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Mail size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-white/70">Email</span>
                <span className="block break-all font-display text-lg">{EMAIL}</span>
              </span>
            </a>
          )}
          {IG && (
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-1 pt-1 text-sm text-white/80 hover:text-langit"
            >
              <Instagram size={16} /> @{IG}
            </a>
          )}
        </div>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">© {new Date().getFullYear()} Duamimbar</p>
    </footer>
  );
}
