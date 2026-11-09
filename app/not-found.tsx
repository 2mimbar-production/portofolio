import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Program tidak ditemukan</h1>
        <p className="mt-3 text-muted">Mungkin programnya belum diterbitkan atau alamatnya salah.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-denim-700 px-5 py-2.5 text-sm text-white hover:bg-denim-500">
          Kembali ke beranda
        </Link>
      </main>
    </>
  );
}
