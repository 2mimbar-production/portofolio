import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// Font judul: ramah & segar, dipadukan Inter untuk teks.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const SITUS = process.env.NEXT_PUBLIC_SITE_URL || "https://2mimbar-portofolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITUS),
  title: "Etalase Program Duamimbar",
  openGraph: {
    type: "website",
    siteName: "Duamimbar",
    locale: "id_ID",
    images: ["/hero-duamimbar.jpg"],
  },
  description: "Portofolio program media Duamimbar: podcast, video, dan konten yang tayang rutin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${bricolage.variable} min-h-screen bg-kanvas font-sans text-navy antialiased`}>{children}</body>
    </html>
  );
}
