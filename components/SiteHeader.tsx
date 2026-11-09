import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <img src="/logo-white.png" alt="" className="h-7 w-auto" />
          <span className="font-display text-lg tracking-wide">Duamimbar</span>
        </Link>
        <nav className="flex items-center gap-4 text-[11px] sm:gap-5 sm:text-xs uppercase tracking-[0.2em] text-white/70">
          <Link href="/#genre" className="hover:text-gold-400">
            Genre
          </Link>
          <Link href="/#channel" className="hover:text-gold-400">
            Channel
          </Link>
          <Link href="/#kontak" className="hover:text-gold-400">
            Kontak
          </Link>
        </nav>
      </div>
    </header>
  );
}
