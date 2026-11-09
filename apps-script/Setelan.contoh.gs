/**
 * Salin jadi Setelan.gs di proyek Apps Script, isi nilainya, lalu jalankan `mulai`.
 * JANGAN commit Setelan.gs yang sudah berisi kunci.
 */
const SETELAN = {
  SPREADSHEET_ID: 'ID spreadsheet Insight Channel Duamimbar',
  SUPABASE_URL: 'https://qkoulearrmscqeykwviv.supabase.co',
  SUPABASE_ANON_KEY: 'anon key Supabase (publik)',
  KUNCI_SUPABASE: 'isi tabel insight_kunci',
};

/** Jalankan sekali: simpan setelan, siapkan tab, ambil data, jadwalkan harian. */
function mulai() {
  PropertiesService.getScriptProperties().setProperties(SETELAN);
  siapkanSheet();
  perbaruiData();
  pasangJadwal();
}
