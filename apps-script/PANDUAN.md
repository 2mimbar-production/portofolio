# Pasang insight channel (sekali saja, ±5 menit)

Alur: YouTube → spreadsheet **Insight Channel Duamimbar** (tiap hari ±05.00) →
ringkasan dikirim ke tabel Supabase `insight_web` → tampil di etalase.

Kode siap-tempel (setelan & kunci sudah terisi) ada di Google Doc privat
**"Pasang Insight Duamimbar (kode Apps Script) - RAHASIA"** di Drive akun 2mimbar.production.
Langkah singkatnya juga ada di Doc itu:

1. Buka spreadsheet → **Ekstensi → Apps Script**.
2. ⚙️ Setelan proyek → centang **Tampilkan file manifes "appsscript.json"**.
3. Tempel BAGIAN A ke `appsscript.json`, BAGIAN B ke `Code.gs`, simpan.
4. Pilih fungsi `mulai` → **Jalankan** → izinkan. Saat ditanya akun/channel,
   **pilih Budi Ashari Official** (supaya watch time & demografi bisa diambil).
   "Google belum memverifikasi aplikasi ini" → Lanjutan → Buka (tidak aman).

`mulai` menyimpan setelan, menyiapkan tab, mengambil data pertama, mengirimnya ke web,
dan menjadwalkan pengambilan harian. Kalau ada yang kosong, cek tab `log`.

File di folder ini adalah versi tanpa rahasia: `Kode.gs` + `appsscript.json`, dan
`Setelan.contoh.gs` (isi nilainya sendiri kalau memasang ulang; kunci ada di tabel
Supabase `insight_kunci`, hanya bisa dilihat lewat SQL Editor).

## Instagram (manual, sebulan sekali)
Di tab `Instagram`, tambah **baris baru** per akun tiap awal bulan (jangan timpa baris lama,
supaya pertumbuhan terhitung). Angkanya dari Instagram → Profil → **Dasbor profesional**
(30 hari terakhir). Akun yang kolom followers-nya kosong tidak ditampilkan.
Data baru ikut terkirim ke web pada pengambilan harian berikutnya.

## Menambah channel / program
Tambah baris di tab `Pengaturan`:
- `youtube_channel` + handle (`@nama`) atau ID channel (`UC...`) + slug bebas.
- `youtube_playlist` + ID playlist (`PL...`) + slug = slug karya di Studio,
  supaya insight-nya muncul di halaman program itu.
