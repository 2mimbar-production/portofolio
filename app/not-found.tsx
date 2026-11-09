import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-white/50">Mungkin programnya belum diterbitkan atau alamatnya salah.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-white px-5 py-2.5 text-sm text-ink-950 hover:bg-gold-400">
          Kembali ke etalase
        </Link>
      </main>
    </>
  );
}
