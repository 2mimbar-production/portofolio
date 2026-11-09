import Link from "next/link";

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const tone = overlay ? "text-white" : "text-denim-900";
  return (
    <header className={`${overlay ? "absolute" : "relative border-b border-denim-100 bg-white"} inset-x-0 top-0 z-20`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className={`font-display text-lg ${tone}`}>
          Duamimbar <span className="font-sans font-normal opacity-60">Program</span>
        </Link>
        <nav className={`flex items-center gap-5 text-sm ${tone}`}>
          <Link href="/#program" className="hover:opacity-70">
            Program
          </Link>
          <Link href="/#kontak" className="hover:opacity-70">
            Kontak
          </Link>
        </nav>
      </div>
    </header>
  );
}
