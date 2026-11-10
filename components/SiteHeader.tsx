import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-navy">
          {/* Logo putih diwarnai navy lewat mask supaya cocok di latar terang. */}
          <span
            aria-hidden
            className="h-7 w-7 bg-navy"
            style={{
              WebkitMask: "url(/logo-white.png) center / contain no-repeat",
              mask: "url(/logo-white.png) center / contain no-repeat",
            }}
          />
          <span className="font-display text-lg tracking-wide">Duamimbar</span>
        </Link>
        <nav className="flex items-center gap-4 text-[11px] sm:gap-5 sm:text-xs uppercase tracking-[0.2em] text-navy/80">
          <Link href="/#genre" className="hover:text-bata">
            Genre
          </Link>
          <Link href="/#channel" className="hover:text-bata">
            Channel
          </Link>
          <Link href="/#kontak" className="hover:text-bata">
            Kontak
          </Link>
        </nav>
      </div>
    </header>
  );
}
