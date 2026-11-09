# Pasang insight channel (sekali saja, ±10 menit)

Spreadsheet: **Insight Channel Duamimbar** di Google Drive akun 2mimbar.production.
Tab `Pengaturan` dan `Instagram` sudah terisi. Tab lain diisi otomatis oleh script.

## 1. Tempel script
1. Buka spreadsheet → **Ekstensi → Apps Script**.
2. Hapus isi `Code.gs`, tempel seluruh isi [`Kode.gs`](./Kode.gs), simpan.
3. Klik ikon ⚙️ **Setelan proyek** → centang **Tampilkan file manifes "appsscript.json"**.
4. Kembali ke Editor, buka `appsscript.json`, ganti isinya dengan [`appsscript.json`](./appsscript.json), simpan.
   (Ini menyalakan layanan YouTube Data API & YouTube Analytics API.)

## 2. Izinkan & ambil data pertama
1. Di editor, pilih fungsi `siapkanSheet` → **Jalankan**. Google minta izin:
   - Pilih akun yang punya akses ke channel Budi Ashari Official.
   - Kalau muncul pilihan channel/akun merek, **pilih Budi Ashari Official**
     (supaya watch time & demografi bisa diambil).
   - "Google belum memverifikasi aplikasi ini" → **Lanjutan → Buka (tidak aman)**. Ini script milikmu sendiri.
2. Jalankan `perbaruiData`. Cek tab `channel`, `demografi`, `video_top`, `program` sudah terisi.
   Kalau ada yang kosong, lihat tab `log`.
3. Jalankan `pasangJadwal` → data diambil otomatis tiap hari jam ±05.00.

## 3. Sambungkan ke web
1. **Terapkan → Deployment baru** → jenis **Aplikasi web**.
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
2. Salin **URL aplikasi web** (berakhiran `/exec`).
3. Muat ulang spreadsheet → menu **Duamimbar → Lihat kunci web**, salin kuncinya.
4. Alamat lengkap: `URL_exec?kunci=KUNCI`. Kirim ke Claude atau isi sendiri sebagai
   env var `INSIGHT_URL` di Vercel project `2mimbar-portofolio`, lalu redeploy.

Spreadsheet tetap privat. Alamat web app hanya mengembalikan ringkasan, dan tanpa
kunci yang benar hanya membalas `kunci salah`.

## Instagram (manual, sebulan sekali)
Di tab `Instagram`, tambah **baris baru** per akun tiap awal bulan (jangan timpa baris lama,
supaya pertumbuhan terhitung):

| tanggal | akun | nama | followers | reach_30_hari | interaksi_30_hari |
|---|---|---|---|---|---|
| 2026-11-01 | hikayatpodcast | Hikayat Podcast | 21000 | 63000 | 4200 |

Angkanya dari Instagram → Profil → **Dasbor profesional / Insight** (30 hari terakhir).
Akun yang kolom followers-nya kosong tidak ditampilkan.

## Menambah channel / program
Tambah baris di tab `Pengaturan`:
- `youtube_channel` + handle (`@nama`) atau ID channel (`UC...`) + slug bebas.
- `youtube_playlist` + ID playlist (`PL...`) + slug = slug karya di Studio,
  supaya insight-nya muncul di halaman program itu.

Kalau `Kode.gs` di repo ini berubah, tempel ulang lalu **Terapkan → Kelola deployment → Edit → Versi baru**.
