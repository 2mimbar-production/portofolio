import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} min-h-screen bg-ink-950 font-sans text-white antialiased`}>{children}</body>
    </html>
  );
}
