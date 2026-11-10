// Isi lewat env var NEXT_PUBLIC_KONTAK_EMAIL & NEXT_PUBLIC_KONTAK_WA (nomor
// format 62xxx). Kalau kosong, barisnya tidak ditampilkan.
const EMAIL = process.env.NEXT_PUBLIC_KONTAK_EMAIL;
const WA = process.env.NEXT_PUBLIC_KONTAK_WA;
const IG = process.env.NEXT_PUBLIC_KONTAK_IG || "media2mimbar";

export default function SiteFooter() {
  return (
    <footer id="kontak" className="mt-24 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="font-display text-2xl text-white">Tertarik kerja sama atau sponsor program?</p>
          <p className="mt-3 max-w-md text-sm text-white/60">
            Duamimbar memproduksi program podcast, video, dan konten media sosial yang tayang rutin.
          </p>
        </div>
        {(EMAIL || WA || IG) && (
          <div className="text-sm sm:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Hubungi kami</p>
            {EMAIL && (
              <a href={`mailto:${EMAIL}`} className="mt-2 block break-all text-lg text-white hover:text-gold-400">
                {EMAIL}
              </a>
            )}
            {WA && (
              <a href={`https://wa.me/${WA}`} className="mt-1 block text-white hover:text-gold-400">
                WhatsApp +{WA}
              </a>
            )}
            {IG && (
              <a
                href={`https://www.instagram.com/${IG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-white hover:text-gold-400"
              >
                Instagram @{IG}
              </a>
            )}
          </div>
        )}
      </div>
      <p className="pb-8 text-center text-xs text-white/30">© {new Date().getFullYear()} Duamimbar</p>
    </footer>
  );
}
