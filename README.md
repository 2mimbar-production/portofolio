# Etalase Program Duamimbar

Web portofolio program media Duamimbar, bentuknya etalase (tema gelap). Datanya
diambil dari Supabase yang sama dengan Studio di repo
`2mimbar-production/2mimbar-production`, jadi tidak ada input data terpisah.

Urutan tampilannya:

- `/`: panel **genre** (kategori karya) yang melebar saat disentuh, lalu deretan semua program.
- `/genre/[slug]`: kartu besar tiap **program** di genre itu, dengan tombol Tonton.
- `/program/[slug]`: kartu program, **galeri** (cover + thumbnail episode YouTube),
  **detail** program dan episode terbaru, lalu **link** ke kanal tayang.

## Cara program muncul di web

1. Studio → **Portofolio**: buat karya (judul, kategori = genre,
   ringkasan, deskripsi, cover, link trailer) lalu centang **Terbit**. Karya terbit
   langsung tampil di etalase.
2. (Opsional) Studio → **Proyek** → Ubah program: isi "Tampil di web portofolio program" dengan
   karya tadi, serta kanal tayang, jadwal tayang, dan target episode.
3. Studio → **Laporan**: episode berstatus **Sudah tayang** yang judulnya diisi
   otomatis masuk ke daftar episode dan galeri.

Program berstatus *batal* tidak tampil. Catatan internal (kendala, PIC, bukti
tayang, dll.) tidak pernah dikirim ke web ini.

## Insight channel & program

Angka YouTube & Instagram dibaca dari spreadsheet lewat Apps Script (`apps-script/`).
Cara pasang: [`apps-script/PANDUAN.md`](apps-script/PANDUAN.md). Tampil di bagian
**Channel** beranda, halaman `/channel/[slug]`, dan **Insight + 5W2H** di halaman program.
Tanpa env `INSIGHT_URL`, bagian-bagian itu otomatis disembunyikan.

## Setup

1. Supabase → SQL Editor: jalankan `supabase/migrations/20261109000000_program_publik.sql`
   (sudah terpasang di project `qkoulearrmscqeykwviv`).
2. Env var (lihat `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, opsional `NEXT_PUBLIC_KONTAK_EMAIL` dan
   `NEXT_PUBLIC_KONTAK_WA` (format 62812xxxx).
3. Vercel project `2mimbar-portofolio` sudah terhubung ke repo ini; setiap push ke
   `main` otomatis deploy.

Halaman di-cache 60 detik, jadi perubahan dari Studio muncul paling lambat semenit kemudian.

## Pengembangan

```
npm install
npm run dev
```
