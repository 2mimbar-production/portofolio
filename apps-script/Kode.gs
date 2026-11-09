/**
 * Insight channel & program Duamimbar.
 *
 * Alur: YouTube -> spreadsheet ini (tiap hari, fungsi perbaruiData)
 *       spreadsheet -> web etalase (fungsi doGet, dibaca Vercel tiap jam).
 *
 * Tab:
 *   Pengaturan  : daftar channel/playlist YouTube yang dipantau (diisi manusia).
 *   Instagram   : angka Instagram, diisi manual sebulan sekali (diisi manusia).
 *   channel     : ringkasan terbaru tiap channel YouTube (ditulis script).
 *   harian      : riwayat subscriber & views per hari (ditulis script).
 *   demografi   : umur, gender, negara penonton 90 hari (ditulis script).
 *   video_top   : video terpopuler 90 hari (ditulis script).
 *   program     : insight per playlist program (ditulis script).
 *   log         : catatan error (ditulis script).
 *
 * Yang dikirim ke web hanya ringkasan di doGet, bukan seluruh spreadsheet.
 */

const TAB = {
  pengaturan: 'Pengaturan',
  instagram: 'Instagram',
  channel: 'channel',
  harian: 'harian',
  demografi: 'demografi',
  videoTop: 'video_top',
  program: 'program',
  log: 'log',
};

const KOLOM = {
  Pengaturan: ['jenis', 'id_atau_handle', 'nama', 'slug', 'catatan'],
  Instagram: ['tanggal', 'akun', 'nama', 'followers', 'reach_30_hari', 'interaksi_30_hari', 'link'],
  channel: ['slug', 'nama', 'url', 'foto', 'subscriber', 'subscriber_naik_30h', 'total_views', 'jumlah_video',
    'views_30h', 'jam_tonton_30h', 'rata_durasi_detik', 'like_30h', 'komentar_30h', 'share_30h', 'diperbarui'],
  harian: ['tanggal', 'slug', 'subscriber', 'total_views'],
  demografi: ['slug', 'jenis', 'label', 'persen'],
  video_top: ['slug', 'judul', 'url', 'thumbnail', 'views_90h', 'tanggal_tayang'],
  program: ['slug', 'playlist_id', 'episode', 'total_views', 'rata_views', 'jam_tonton', 'like',
    'top_judul', 'top_url', 'top_views', 'diperbarui'],
  log: ['waktu', 'bagian', 'pesan'],
};

/* ───────────────────────── Menu & persiapan ───────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Duamimbar')
    .addItem('1. Siapkan tab', 'siapkanSheet')
    .addItem('2. Ambil data sekarang', 'perbaruiData')
    .addItem('3. Jadwalkan otomatis tiap hari', 'pasangJadwal')
    .addItem('Lihat kunci web', 'tampilkanKunci')
    .addToUi();
}

/** Buat tab yang belum ada beserta judul kolomnya. Aman dijalankan ulang. */
function siapkanSheet() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(KOLOM).forEach((nama) => {
    let sh = ss.getSheetByName(nama);
    if (!sh) sh = ss.insertSheet(nama);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, KOLOM[nama].length).setValues([KOLOM[nama]]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });
  kunciWeb_();
  SpreadsheetApp.getActive().toast('Tab siap. Isi tab Pengaturan & Instagram, lalu jalankan "Ambil data sekarang".');
}

/** Jalankan perbaruiData tiap hari sekitar jam 05.00 WIB. */
function pasangJadwal() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'perbaruiData')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('perbaruiData').timeBased().everyDays(1).atHour(5).create();
  SpreadsheetApp.getActive().toast('Terjadwal: data diambil otomatis tiap hari sekitar jam 05.00.');
}

/** Kunci acak supaya hanya web etalase yang bisa membaca ringkasan. */
function kunciWeb_() {
  const props = PropertiesService.getScriptProperties();
  let kunci = props.getProperty('KUNCI_WEB');
  if (!kunci) {
    kunci = Utilities.getUuid().replace(/-/g, '');
    props.setProperty('KUNCI_WEB', kunci);
  }
  return kunci;
}

function tampilkanKunci() {
  SpreadsheetApp.getUi().alert('Kunci web: ' + kunciWeb_() +
    '\n\nTambahkan ke alamat web app: ...exec?kunci=' + kunciWeb_());
}

/* ───────────────────────── Ambil data YouTube ───────────────────────── */

function perbaruiData() {
  const pengaturan = bacaTab_(TAB.pengaturan);
  const hasil = { channel: [], harian: [], demografi: [], video_top: [], program: [] };
  const hariIni = tanggal_(0);

  pengaturan
    .filter((r) => String(r.jenis).toLowerCase() === 'youtube_channel' && r.id_atau_handle)
    .forEach((r) => {
      try {
        ambilChannel_(r, hasil, hariIni);
      } catch (e) {
        catatLog_('channel ' + r.id_atau_handle, e);
      }
    });

  pengaturan
    .filter((r) => String(r.jenis).toLowerCase() === 'youtube_playlist' && r.id_atau_handle && r.slug)
    .forEach((r) => {
      try {
        hasil.program.push(ambilPlaylist_(r));
      } catch (e) {
        catatLog_('playlist ' + r.id_atau_handle, e);
      }
    });

  tulisUlang_(TAB.channel, hasil.channel);
  tulisUlang_(TAB.demografi, hasil.demografi);
  tulisUlang_(TAB.videoTop, hasil.video_top);
  tulisUlang_(TAB.program, hasil.program);
  tambahHarian_(hasil.harian, hariIni);
}

function ambilChannel_(r, hasil, hariIni) {
  const idAtauHandle = String(r.id_atau_handle).trim();
  const opsi = idAtauHandle.startsWith('UC') ? { id: idAtauHandle } : { forHandle: idAtauHandle.replace(/^@?/, '@') };
  const res = YouTube.Channels.list('snippet,statistics', opsi);
  if (!res.items || !res.items.length) throw new Error('Channel tidak ditemukan: ' + idAtauHandle);
  const ch = res.items[0];
  const slug = r.slug || slugify_(ch.snippet.title);
  const st = ch.statistics;

  const baris = {
    slug,
    nama: r.nama || ch.snippet.title,
    url: 'https://www.youtube.com/' + (ch.snippet.customUrl || 'channel/' + ch.id),
    foto: (ch.snippet.thumbnails.high || ch.snippet.thumbnails.default).url,
    subscriber: Number(st.subscriberCount || 0),
    subscriber_naik_30h: '',
    total_views: Number(st.viewCount || 0),
    jumlah_video: Number(st.videoCount || 0),
    views_30h: '', jam_tonton_30h: '', rata_durasi_detik: '', like_30h: '', komentar_30h: '', share_30h: '',
    diperbarui: new Date().toISOString(),
  };
  hasil.harian.push({ tanggal: hariIni, slug, subscriber: baris.subscriber, total_views: baris.total_views });

  // YouTube Analytics hanya bisa untuk channel yang aksesnya dimiliki akun ini.
  // Data Analytics terlambat ~2-3 hari, jadi jendela 30 hari diakhiri 3 hari lalu.
  try {
    const ids = idsAnalytics_(ch.id);
    const mulai30 = tanggal_(-32), selesai = tanggal_(-3), mulai90 = tanggal_(-92);

    const r30 = YouTubeAnalytics.Reports.query({
      ids, startDate: mulai30, endDate: selesai,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares',
    });
    const v = (r30.rows && r30.rows[0]) || [];
    baris.views_30h = v[0] || 0;
    baris.jam_tonton_30h = Math.round((v[1] || 0) / 60);
    baris.rata_durasi_detik = Math.round(v[2] || 0);
    baris.subscriber_naik_30h = (v[3] || 0) - (v[4] || 0);
    baris.like_30h = v[5] || 0;
    baris.komentar_30h = v[6] || 0;
    baris.share_30h = v[7] || 0;

    // Umur & gender (persen penonton).
    const ag = YouTubeAnalytics.Reports.query({
      ids, startDate: mulai90, endDate: selesai, dimensions: 'ageGroup,gender', metrics: 'viewerPercentage',
    });
    const usia = {}, gender = {};
    (ag.rows || []).forEach(([umur, jk, persen]) => {
      usia[umur] = (usia[umur] || 0) + persen;
      gender[jk] = (gender[jk] || 0) + persen;
    });
    Object.keys(usia).sort().forEach((k) =>
      hasil.demografi.push({ slug, jenis: 'usia', label: k.replace('age', '').replace('-', '–'), persen: bulat_(usia[k]) }));
    Object.keys(gender).forEach((k) =>
      hasil.demografi.push({ slug, jenis: 'gender', label: k === 'male' ? 'Laki-laki' : k === 'female' ? 'Perempuan' : 'Lainnya', persen: bulat_(gender[k]) }));

    // Negara teratas (persen dari views).
    const ng = YouTubeAnalytics.Reports.query({
      ids, startDate: mulai90, endDate: selesai, dimensions: 'country', metrics: 'views', sort: '-views', maxResults: 5,
    });
    const totalNg = (ng.rows || []).reduce((a, x) => a + x[1], 0) || 1;
    (ng.rows || []).forEach(([kode, views]) =>
      hasil.demografi.push({ slug, jenis: 'negara', label: namaNegara_(kode), persen: bulat_((views / totalNg) * 100) }));

    // Video terpopuler 90 hari.
    const vt = YouTubeAnalytics.Reports.query({
      ids, startDate: mulai90, endDate: selesai, dimensions: 'video', metrics: 'views', sort: '-views', maxResults: 6,
    });
    const idVideo = (vt.rows || []).map((x) => x[0]);
    const detail = idVideo.length ? YouTube.Videos.list('snippet', { id: idVideo.join(',') }).items : [];
    (vt.rows || []).forEach(([id, views]) => {
      const d = detail.find((x) => x.id === id);
      if (!d) return;
      hasil.video_top.push({
        slug, judul: d.snippet.title, url: 'https://youtu.be/' + id,
        thumbnail: (d.snippet.thumbnails.high || d.snippet.thumbnails.default).url,
        views_90h: views, tanggal_tayang: d.snippet.publishedAt.slice(0, 10),
      });
    });
  } catch (e) {
    catatLog_('analytics ' + slug, e);
  }

  hasil.channel.push(baris);
}

/** channel==ID untuk channel yang dikelola, fallback ke channel==MINE. */
function idsAnalytics_(channelId) {
  try {
    YouTubeAnalytics.Reports.query({ ids: 'channel==' + channelId, startDate: tanggal_(-10), endDate: tanggal_(-3), metrics: 'views' });
    return 'channel==' + channelId;
  } catch (e) {
    return 'channel==MINE';
  }
}

function ambilPlaylist_(r) {
  const playlistId = String(r.id_atau_handle).trim();
  const idVideo = [];
  let token;
  do {
    const res = YouTube.PlaylistItems.list('contentDetails', { playlistId, maxResults: 50, pageToken: token });
    (res.items || []).forEach((x) => idVideo.push(x.contentDetails.videoId));
    token = res.nextPageToken;
  } while (token);

  const video = [];
  for (let i = 0; i < idVideo.length; i += 50) {
    const res = YouTube.Videos.list('snippet,statistics', { id: idVideo.slice(i, i + 50).join(',') });
    (res.items || []).forEach((x) => video.push(x));
  }
  const totalViews = video.reduce((a, x) => a + Number(x.statistics.viewCount || 0), 0);
  const like = video.reduce((a, x) => a + Number(x.statistics.likeCount || 0), 0);
  const top = video.slice().sort((a, b) => Number(b.statistics.viewCount || 0) - Number(a.statistics.viewCount || 0))[0];

  // Jam tonton seumur playlist (butuh akses Analytics ke channel pemilik video).
  let jamTonton = '';
  try {
    if (video.length) {
      const channelId = video[0].snippet.channelId;
      let menit = 0;
      for (let i = 0; i < idVideo.length; i += 200) {
        const res = YouTubeAnalytics.Reports.query({
          ids: idsAnalytics_(channelId), startDate: '2015-01-01', endDate: tanggal_(-3),
          metrics: 'estimatedMinutesWatched', filters: 'video==' + idVideo.slice(i, i + 200).join(','),
        });
        menit += (res.rows && res.rows[0] && res.rows[0][0]) || 0;
      }
      jamTonton = Math.round(menit / 60);
    }
  } catch (e) {
    catatLog_('jam tonton playlist ' + playlistId, e);
  }

  return {
    slug: r.slug, playlist_id: playlistId, episode: video.length, total_views: totalViews,
    rata_views: video.length ? Math.round(totalViews / video.length) : 0, jam_tonton: jamTonton, like,
    top_judul: top ? top.snippet.title : '', top_url: top ? 'https://youtu.be/' + top.id : '',
    top_views: top ? Number(top.statistics.viewCount || 0) : '', diperbarui: new Date().toISOString(),
  };
}

/* ───────────────────────── Sajikan ke web ───────────────────────── */

/**
 * Dipanggil web etalase: GET .../exec?kunci=XXXX
 * Hanya mengirim ringkasan yang layak dilihat sponsor.
 */
function doGet(e) {
  if (!e || !e.parameter || e.parameter.kunci !== kunciWeb_()) {
    return json_({ error: 'kunci salah' });
  }
  const channel = bacaTab_(TAB.channel);
  const harian = bacaTab_(TAB.harian);
  const demografi = bacaTab_(TAB.demografi);
  const videoTop = bacaTab_(TAB.videoTop);

  const youtube = channel.map((c) => ({
    platform: 'YouTube',
    slug: c.slug, nama: c.nama, url: c.url, foto: c.foto,
    pengikut: angka_(c.subscriber), pengikut_naik_30h: angka_(c.subscriber_naik_30h),
    total_views: angka_(c.total_views), jumlah_video: angka_(c.jumlah_video),
    views_30h: angka_(c.views_30h), jam_tonton_30h: angka_(c.jam_tonton_30h),
    rata_durasi_detik: angka_(c.rata_durasi_detik),
    interaksi_30h: jumlah_(c.like_30h, c.komentar_30h, c.share_30h),
    tren: harian.filter((h) => h.slug === c.slug).slice(-90)
      .map((h) => ({ tanggal: teksTanggal_(h.tanggal), nilai: angka_(h.subscriber) })),
    demografi: {
      usia: demografi.filter((d) => d.slug === c.slug && d.jenis === 'usia').map(labelPersen_),
      gender: demografi.filter((d) => d.slug === c.slug && d.jenis === 'gender').map(labelPersen_),
      negara: demografi.filter((d) => d.slug === c.slug && d.jenis === 'negara').map(labelPersen_),
    },
    video_top: videoTop.filter((v) => v.slug === c.slug).map((v) => ({
      judul: v.judul, url: v.url, thumbnail: v.thumbnail, views: angka_(v.views_90h),
    })),
    diperbarui: c.diperbarui,
  }));

  // Instagram: baris terbaru per akun, kenaikan dibanding baris sebelumnya.
  const ig = bacaTab_(TAB.instagram).filter((r) => r.akun && r.followers !== '');
  const perAkun = {};
  ig.forEach((r) => {
    const k = String(r.akun).replace(/^@/, '').trim().toLowerCase();
    (perAkun[k] = perAkun[k] || []).push(r);
  });
  const instagram = Object.keys(perAkun).map((akun) => {
    const daftar = perAkun[akun].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    const akhir = daftar[daftar.length - 1];
    const sebelum = daftar[daftar.length - 2];
    return {
      platform: 'Instagram',
      slug: 'ig-' + akun.replace(/[^a-z0-9]+/g, '-'),
      nama: akhir.nama || '@' + akun,
      url: akhir.link || 'https://www.instagram.com/' + akun,
      foto: null,
      pengikut: angka_(akhir.followers),
      pengikut_naik_30h: sebelum ? angka_(akhir.followers) - angka_(sebelum.followers) : null,
      views_30h: angka_(akhir.reach_30_hari),
      interaksi_30h: angka_(akhir.interaksi_30_hari),
      tren: daftar.map((r) => ({ tanggal: teksTanggal_(r.tanggal), nilai: angka_(r.followers) })),
      diperbarui: teksTanggal_(akhir.tanggal),
    };
  });

  const program = bacaTab_(TAB.program).map((p) => ({
    slug: p.slug, episode: angka_(p.episode), total_views: angka_(p.total_views),
    rata_views: angka_(p.rata_views), jam_tonton: angka_(p.jam_tonton), like: angka_(p.like),
    top: p.top_url ? { judul: p.top_judul, url: p.top_url, views: angka_(p.top_views) } : null,
  }));

  return json_({ diperbarui: new Date().toISOString(), channel: youtube.concat(instagram), program });
}

/* ───────────────────────── Bantuan ───────────────────────── */

function bacaTab_(nama) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nama);
  if (!sh || sh.getLastRow() < 2) return [];
  const [kepala, ...isi] = sh.getDataRange().getValues();
  return isi
    .filter((r) => r.some((x) => x !== ''))
    .map((r) => Object.fromEntries(kepala.map((k, i) => [String(k).trim(), r[i]])));
}

function tulisUlang_(nama, baris) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nama);
  if (!sh) return;
  const kolom = KOLOM[nama];
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
  if (baris.length) sh.getRange(2, 1, baris.length, kolom.length).setValues(baris.map((b) => kolom.map((k) => b[k] ?? '')));
}

/** Satu baris per channel per hari; ambil ulang di hari yang sama menimpa baris hari itu. */
function tambahHarian_(baris, hariIni) {
  const sh = SpreadsheetApp.getActive().getSheetByName(TAB.harian);
  if (!sh || !baris.length) return;
  const data = sh.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (teksTanggal_(data[i][0]) === hariIni && baris.some((b) => b.slug === data[i][1])) sh.deleteRow(i + 1);
  }
  baris.forEach((b) => sh.appendRow(KOLOM.harian.map((k) => b[k])));
}

function catatLog_(bagian, e) {
  const sh = SpreadsheetApp.getActive().getSheetByName(TAB.log);
  if (sh) sh.appendRow([new Date(), bagian, String(e && e.message ? e.message : e)]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function tanggal_(selisihHari) {
  const d = new Date();
  d.setDate(d.getDate() + selisihHari);
  return Utilities.formatDate(d, 'Asia/Jakarta', 'yyyy-MM-dd');
}

function teksTanggal_(x) {
  return x instanceof Date ? Utilities.formatDate(x, 'Asia/Jakarta', 'yyyy-MM-dd') : String(x).slice(0, 10);
}

function angka_(x) {
  const n = Number(String(x).replace(/[^\d.-]/g, ''));
  return x === '' || x === null || isNaN(n) ? null : n;
}

function jumlah_(...xs) {
  const ada = xs.map(angka_).filter((n) => n !== null);
  return ada.length ? ada.reduce((a, b) => a + b, 0) : null;
}

function bulat_(x) {
  return Math.round(x * 10) / 10;
}

function labelPersen_(d) {
  return { label: d.label, persen: angka_(d.persen) };
}

function slugify_(t) {
  return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function namaNegara_(kode) {
  const peta = { ID: 'Indonesia', MY: 'Malaysia', SG: 'Singapura', BN: 'Brunei', SA: 'Arab Saudi', US: 'Amerika Serikat',
    AU: 'Australia', JP: 'Jepang', NL: 'Belanda', GB: 'Inggris', DE: 'Jerman', EG: 'Mesir', AE: 'Uni Emirat Arab',
    QA: 'Qatar', TW: 'Taiwan', HK: 'Hong Kong', KR: 'Korea Selatan', TR: 'Turki' };
  return peta[kode] || kode;
}
