const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dbService = require('../services/dbService');
const { verifikasiToken, cekPeran } = require('../middleware/auth');
const { pool } = require('../config/db');

// Semua rute admin wajib login dan memiliki peran 'admin'
router.use(verifikasiToken, cekPeran('admin'));

// GET /api/admin/statistik
router.get('/statistik', async (req, res) => {
  try {
    const stats = await dbService.getStatistik();
    const pesanBaru = dbService.store.pesan_kontak.filter(p => p.status === 'baru').length;
    const totalPengguna = dbService.store.pengguna.length;
    const kegiatanDraft = dbService.store.kegiatan.filter(k => k.status === 'draft').length;
    const kegiatanDisembunyikan = dbService.store.kegiatan.filter(k => k.status === 'disembunyikan').length;

    res.json({
      data: {
        ...stats.ringkasan,
        pesan_baru: pesanBaru,
        total_pengguna: totalPengguna,
        kegiatan_draft: kegiatanDraft,
        kegiatan_disembunyikan: kegiatanDisembunyikan,
        per_pokja: stats.per_pokja,
        bulanan: stats.bulanan
      }
    });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat statistik admin.' });
  }
});

// GET /api/admin/pengguna - Daftar akun pengguna
router.get('/pengguna', async (req, res) => {
  try {
    if (dbService.isPostgres()) {
      const result = await pool.query(`
        SELECT p.id, p.nama, p.email, p.peran, p.pokja_id, p.wajib_ganti_sandi, p.aktif, p.dibuat_pada,
               pok.nama AS pokja_nama
        FROM pengguna p
        LEFT JOIN pokja pok ON p.pokja_id = pok.id
        ORDER BY p.id ASC
      `);
      return res.json({ data: result.rows });
    }

    const data = dbService.store.pengguna.map(u => {
      const pok = dbService.store.pokja.find(x => x.id === u.pokja_id);
      const { password_hash, ...rest } = u;
      return {
        ...rest,
        pokja_nama: pok ? pok.nama : (u.peran === 'admin' ? 'Pusat / Admin' : '')
      };
    });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat daftar pengguna.' });
  }
});

// POST /api/admin/pengguna - Buat akun baru (Sandi sementara)
router.post('/pengguna', async (req, res) => {
  try {
    const { nama, email, peran, pokja_id, kata_sandi_sementara } = req.body;

    if (!nama || !email || !peran) {
      return res.status(422).json({ kode: 'VALIDASI_GAGAL', pesan: 'Nama, email, dan peran wajib diisi.' });
    }

    if (peran === 'pengurus_pokja' && !pokja_id) {
      return res.status(422).json({ kode: 'VALIDASI_GAGAL', pesan: 'Pengurus Pokja wajib memilih Pokja.' });
    }

    const existing = await dbService.cariPenggunaByEmail(email);
    if (existing) {
      return res.status(422).json({ kode: 'EMAIL_SUDAH_ADA', pesan: 'Email ini sudah terdaftar di sistem.' });
    }

    const tempPassword = kata_sandi_sementara || 'Pokja#2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(tempPassword, salt);

    const userBaru = await dbService.buatPengguna({
      nama,
      email,
      password_hash: hash,
      peran,
      pokja_id: peran === 'pengurus_pokja' ? Number(pokja_id) : null,
      wajib_ganti_sandi: true
    });

    dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'CREATE_USER', 'pengguna', userBaru.id, `Membuat akun baru: ${nama} (${email})`);

    res.status(201).json({
      pesan: 'Akun berhasil dibuat. Berikan sandi sementara kepada pengguna.',
      sandi_sementara: tempPassword,
      data: userBaru
    });
  } catch (err) {
    console.error('Error buat pengguna:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal membuat akun pengguna.' });
  }
});

// POST /api/admin/pengguna/:id/reset-sandi
router.post('/pengguna/:id/reset-sandi', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const targetUser = await dbService.cariPenggunaById(id);
    if (!targetUser) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pengguna tidak ditemukan.' });

    const newTempPassword = 'Sandi' + Math.floor(1000 + Math.random() * 9000) + '#';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newTempPassword, salt);

    await dbService.ubahSandiPengguna(id, hash, true);

    dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'RESET_PASSWORD', 'pengguna', id, `Mereset sandi akun ${targetUser.email}`);

    res.json({
      pesan: `Kata sandi berhasil direset. Silakan salin sandi sementara ini: ${newTempPassword}`,
      sandi_sementara: newTempPassword
    });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal mereset kata sandi.' });
  }
});

// PATCH /api/admin/pengguna/:id - Ubah status aktif / data akun
router.patch('/pengguna/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, peran, pokja_id, aktif } = req.body;

    const u = dbService.store.pengguna.find(x => x.id === id);
    if (!u) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pengguna tidak ditemukan.' });

    if (nama !== undefined) u.nama = nama;
    if (peran !== undefined) u.peran = peran;
    if (pokja_id !== undefined) u.pokja_id = pokja_id ? Number(pokja_id) : null;
    if (aktif !== undefined) u.aktif = Boolean(aktif);

    dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'UPDATE_USER', 'pengguna', id, `Mengubah status/data akun ${u.email}`);

    const { password_hash, ...rest } = u;
    res.json({ pesan: 'Data akun berhasil diperbarui.', data: rest });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui akun.' });
  }
});

// GET /api/admin/pesan - Daftar pesan warga
router.get('/pesan', async (req, res) => {
  try {
    const { status, jenis } = req.query;
    let list = [...dbService.store.pesan_kontak];

    if (status) list = list.filter(p => p.status === status);
    if (jenis) list = list.filter(p => p.jenis === jenis);

    list.sort((a, b) => b.id - a.id);
    const data = list.map(p => {
      const prod = p.produk_id ? dbService.store.produk.find(pr => pr.id === p.produk_id) : null;
      return {
        ...p,
        produk_nama: prod ? prod.nama : null,
        produk_pemilik: prod ? prod.nama_pemilik : null,
        produk_kontak: prod ? prod.no_telepon : null
      };
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat daftar pesan.' });
  }
});

// PATCH /api/admin/pesan/:id - Ubah status pesan & catatan
router.patch('/pesan/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, catatan_admin } = req.body;

    const p = dbService.store.pesan_kontak.find(x => x.id === id);
    if (!p) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pesan tidak ditemukan.' });

    if (status) p.status = status;
    if (catatan_admin !== undefined) p.catatan_admin = catatan_admin;

    res.json({ pesan: 'Status pesan berhasil diperbarui.', data: p });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui status pesan.' });
  }
});

// PATCH /api/admin/kegiatan/:id/status - Moderasi kegiatan (terbit / disembunyikan)
router.patch('/kegiatan/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!['terbit', 'disembunyikan', 'draft'].includes(status)) {
      return res.status(422).json({ kode: 'VALIDASI_GAGAL', pesan: 'Status tidak valid.' });
    }

    const k = dbService.store.kegiatan.find(x => x.id === id);
    if (!k) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Kegiatan tidak ditemukan.' });

    k.status = status;
    k.diperbarui_pada = new Date().toISOString();

    dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'MODERATION', 'kegiatan', id, `Mengubah status kegiatan "${k.judul}" menjadi ${status}`);

    res.json({ pesan: `Status kegiatan berhasil diubah menjadi ${status}.`, data: k });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui status kegiatan.' });
  }
});

// CRUD Pengumuman (Admin)
router.get('/pengumuman', (req, res) => {
  const data = [...dbService.store.pengumuman].sort((a, b) => b.id - a.id);
  res.json({ data });
});

router.post('/pengumuman', (req, res) => {
  const { judul, isi, penting, tayang_mulai, tayang_sampai } = req.body;
  if (!judul || !isi || !tayang_mulai || !tayang_sampai) {
    return res.status(422).json({ kode: 'VALIDASI_GAGAL', pesan: 'Semua kolom pengumuman wajib diisi.' });
  }
  dbService.counters.pengumuman += 1;
  const item = {
    id: dbService.counters.pengumuman,
    judul,
    isi,
    penting: Boolean(penting),
    tayang_mulai,
    tayang_sampai,
    dibuat_pada: new Date().toISOString()
  };
  dbService.store.pengumuman.unshift(item);
  dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'CREATE', 'pengumuman', item.id, `Membuat pengumuman: "${judul}"`);
  res.status(201).json({ pesan: 'Pengumuman berhasil diterbitkan.', data: item });
});

router.patch('/pengumuman/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = dbService.store.pengumuman.find(x => x.id === id);
  if (!item) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pengumuman tidak ditemukan.' });
  const { judul, isi, penting, tayang_mulai, tayang_sampai } = req.body;
  if (judul !== undefined) item.judul = judul;
  if (isi !== undefined) item.isi = isi;
  if (penting !== undefined) item.penting = Boolean(penting);
  if (tayang_mulai !== undefined) item.tayang_mulai = tayang_mulai;
  if (tayang_sampai !== undefined) item.tayang_sampai = tayang_sampai;
  dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'UPDATE', 'pengumuman', id, `Mengubah pengumuman: "${item.judul}"`);
  res.json({ pesan: 'Pengumuman berhasil diperbarui.', data: item });
});

router.delete('/pengumuman/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = dbService.store.pengumuman.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pengumuman tidak ditemukan.' });
  const [removed] = dbService.store.pengumuman.splice(idx, 1);
  dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'DELETE', 'pengumuman', id, `Menghapus pengumuman: "${removed.judul}"`);
  res.json({ pesan: 'Pengumuman berhasil dihapus.' });
});

// GET /api/admin/log - Jejak Audit
router.get('/log', (req, res) => {
  res.json({ data: dbService.store.log_aktivitas });
});

module.exports = router;
