const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');

// GET /api/publik/beranda - Ringkasan Beranda
router.get('/beranda', async (req, res) => {
  try {
    const [kegiatanTerbaru, jadwalTerdekat, pengumumanAktif, statistik] = await Promise.all([
      dbService.getKegiatanPublik({ batas: 4 }),
      dbService.getJadwalList({ status: 'akan_datang' }),
      dbService.getPengumumanAktif(),
      dbService.getStatistik()
    ]);

    const pokjaList = await dbService.getPokjaList();

    res.json({
      data: {
        kegiatan_terbaru: kegiatanTerbaru.data,
        jadwal_terdekat: jadwalTerdekat.slice(0, 3),
        pengumuman_aktif: pengumumanAktif,
        pokja: pokjaList,
        statistik: statistik.ringkasan
      }
    });
  } catch (err) {
    console.error('Error publik beranda:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat data beranda.' });
  }
});

// GET /api/publik/kegiatan - Arsip Dokumentasi (Filter Kata Kunci, Pokja, & Kalender Tanggal)
router.get('/kegiatan', async (req, res) => {
  try {
    const { q, pokja, tanggal, halaman } = req.query;
    const hasil = await dbService.getKegiatanPublik({
      q,
      pokja,
      tanggal,
      halaman: halaman ? parseInt(halaman, 10) : 1,
      batas: 9
    });
    res.json(hasil);
  } catch (err) {
    console.error('Error publik kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat arsip kegiatan.' });
  }
});

// GET /api/publik/kegiatan/:id - Detail Kegiatan
router.get('/kegiatan/:id', async (req, res) => {
  try {
    const kegiatan = await dbService.getKegiatanDetail(req.params.id);
    if (!kegiatan || kegiatan.status !== 'terbit') {
      return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Dokumentasi kegiatan tidak ditemukan atau belum terbit.' });
    }
    res.json({ data: kegiatan });
  } catch (err) {
    console.error('Error detail kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat detail kegiatan.' });
  }
});

// GET /api/publik/profil-pengurus - Struktur TP PKK
router.get('/profil-pengurus', async (req, res) => {
  try {
    const pengurus = await dbService.getProfilPengurus();
    res.json({ data: pengurus });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat profil pengurus.' });
  }
});

// GET /api/publik/produk - Etalase Produk Anggota (SDGs 5)
// Menampilkan nama produk, foto, harga, nama_pemilik, dan no_telepon (WhatsApp)
router.get('/produk', async (req, res) => {
  try {
    const { pokja, search } = req.query;
    const produkList = await dbService.getProdukList({ pokja, search });
    res.json({
      data: produkList,
      catatan_sdgs: 'Etalase non-transaksi ini mendukung kemandirian ekonomi perempuan PKK (SDGs 5). Pemesanan dilakukan langsung ke nomor WhatsApp pemilik produk.'
    });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat etalase produk.' });
  }
});

// GET /api/publik/jadwal - Agenda Kegiatan
router.get('/jadwal', async (req, res) => {
  try {
    const { status } = req.query;
    const jadwal = await dbService.getJadwalList({ status });
    res.json({ data: jadwal });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat jadwal kegiatan.' });
  }
});

// GET /api/publik/pengumuman - Pengumuman Aktif
router.get('/pengumuman', async (req, res) => {
  try {
    const pengumuman = await dbService.getPengumumanAktif();
    res.json({ data: pengumuman });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat pengumuman.' });
  }
});

// GET /api/publik/statistik - Capaian SDGs 5
router.get('/statistik', async (req, res) => {
  try {
    const statistik = await dbService.getStatistik();
    res.json({ data: statistik });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat statistik.' });
  }
});

// POST /api/publik/pesan - Formulir Kontak Warga / Pertanyaan Produk / Relawan
router.post('/pesan', async (req, res) => {
  try {
    const { nama_pengirim, kontak_pengirim, jenis, produk_id, pesan, website_url } = req.body;

    // Honeypot spam bot check: jika website_url terisi, tolak diam-diam
    if (website_url) {
      return res.status(200).json({ pesan: 'Pesan Anda berhasil dikirim.' });
    }

    if (!nama_pengirim || !kontak_pengirim || !pesan) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Nama, kontak (WhatsApp/Email), dan pesan wajib diisi.'
      });
    }

    const jenisValid = ['pertanyaan', 'pesanan_produk', 'relawan', 'lainnya'];
    const finalJenis = jenisValid.includes(jenis) ? jenis : 'pertanyaan';

    let idBaru;
    if (dbService.isPostgres()) {
      const query = `
        INSERT INTO pesan_kontak (nama_pengirim, kontak_pengirim, jenis, produk_id, pesan, status)
        VALUES ($1, $2, $3, $4, $5, 'baru')
        RETURNING id
      `;
      const result = await require('../config/db').query(query, [
        nama_pengirim,
        kontak_pengirim,
        finalJenis,
        produk_id ? Number(produk_id) : null,
        pesan
      ]);
      idBaru = result.rows[0].id;
    } else {
      dbService.counters.pesan_kontak += 1;
      idBaru = dbService.counters.pesan_kontak;
      dbService.store.pesan_kontak.unshift({
        id: idBaru,
        nama_pengirim,
        kontak_pengirim,
        jenis: finalJenis,
        produk_id: produk_id ? Number(produk_id) : null,
        pesan,
        status: 'baru',
        catatan_admin: null,
        dibuat_pada: new Date().toISOString()
      });
    }

    res.status(201).json({
      pesan: 'Terima kasih, pesan Anda telah diterima oleh pengurus PKK Kelurahan Kapasmadya Baru.',
      id: idBaru
    });
  } catch (err) {
    console.error('Error kirim pesan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal mengirimkan pesan.' });
  }
});

module.exports = router;
