const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const { verifikasiToken } = require('../middleware/auth');
const { pool } = require('../config/db');

router.use(verifikasiToken);

// GET /api/kegiatan - Daftar dokumentasi untuk dashboard
router.get('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let pokjaFilter = req.query.pokja_id ? Number(req.query.pokja_id) : null;

    // Jika pengurus pokja, batasi hanya pokja miliknya
    if (user.peran === 'pengurus_pokja') {
      pokjaFilter = user.pokja_id;
    }

    if (dbService.isPostgres()) {
      let query = `
        SELECT k.*, p.nama AS pokja_nama, p.singkatan AS pokja_singkatan, p.warna_heksadesimal AS pokja_warna
        FROM kegiatan k
        JOIN pokja p ON k.pokja_id = p.id
      `;
      let params = [];
      if (pokjaFilter) {
        query += ' WHERE k.pokja_id = $1';
        params.push(pokjaFilter);
      }
      query += ' ORDER BY k.tanggal DESC';
      const result = await pool.query(query, params);
      return res.json({ data: result.rows });
    }

    let list = [...dbService.store.kegiatan];
    if (pokjaFilter) {
      list = list.filter(k => k.pokja_id === pokjaFilter);
    }
    list.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    const data = list.map(k => {
      const p = dbService.store.pokja.find(x => x.id === k.pokja_id);
      return {
        ...k,
        pokja_nama: p ? p.nama : '',
        pokja_singkatan: p ? p.singkatan : '',
        pokja_warna: p ? p.warna_heksadesimal : '#2563EB'
      };
    });

    res.json({ data });
  } catch (err) {
    console.error('Error get kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat dokumentasi.' });
  }
});

// POST /api/kegiatan - Unggah dokumentasi baru (3 isian wajib: judul, tanggal, pokja)
router.post('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let { judul, tanggal, pokja_id, ringkasan, lokasi, jumlah_peserta, tautan_sosmed, status, foto_sampul } = req.body;

    // Kunci pokja_id untuk pengurus pokja
    if (user.peran === 'pengurus_pokja') {
      pokja_id = user.pokja_id;
    }

    // 3 Isian Wajib
    if (!judul || !tanggal || !pokja_id) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Tiga kolom wajib diisi: Judul kegiatan, Tanggal, dan Pokja.'
      });
    }

    const finalStatus = status === 'draft' ? 'draft' : 'terbit';
    const finalPeserta = jumlah_peserta ? parseInt(jumlah_peserta, 10) : 0;
    const finalFoto = foto_sampul || 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80';

    let itemBaru;
    if (dbService.isPostgres()) {
      const query = `
        INSERT INTO kegiatan (judul, tanggal, pokja_id, pengguna_id, ringkasan, lokasi, jumlah_peserta, tautan_sosmed, status, foto_sampul)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const result = await pool.query(query, [
        judul,
        tanggal,
        Number(pokja_id),
        user.id,
        ringkasan || null,
        lokasi || null,
        finalPeserta,
        tautan_sosmed || null,
        finalStatus,
        finalFoto
      ]);
      itemBaru = result.rows[0];
    } else {
      dbService.counters.kegiatan += 1;
      itemBaru = {
        id: dbService.counters.kegiatan,
        judul,
        tanggal,
        pokja_id: Number(pokja_id),
        pengguna_id: user.id,
        ringkasan: ringkasan || null,
        lokasi: lokasi || null,
        jumlah_peserta: finalPeserta,
        tautan_sosmed: tautan_sosmed || null,
        status: finalStatus,
        foto_sampul: finalFoto,
        dibuat_pada: new Date().toISOString(),
        diperbarui_pada: new Date().toISOString()
      };
      dbService.store.kegiatan.unshift(itemBaru);
    }

    dbService.tambahLog(user.id, user.nama, 'CREATE', 'kegiatan', itemBaru.id, `Mengunggah dokumentasi: "${judul}" (${finalStatus})`);

    res.status(201).json({
      pesan: finalStatus === 'draft' ? 'Dokumentasi berhasil disimpan sebagai draf.' : 'Dokumentasi berhasil disimpan dan terbit di website publik.',
      data: itemBaru
    });
  } catch (err) {
    console.error('Error simpan kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menyimpan dokumentasi.' });
  }
});

// PATCH /api/kegiatan/:id - Ubah dokumentasi
router.patch('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);
    const { judul, tanggal, pokja_id, ringkasan, lokasi, jumlah_peserta, tautan_sosmed, status, foto_sampul } = req.body;

    let targetKegiatan = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Kegiatan tidak ditemukan.' });
      targetKegiatan = check.rows[0];
    } else {
      targetKegiatan = dbService.store.kegiatan.find(k => k.id === id);
      if (!targetKegiatan) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Kegiatan tidak ditemukan.' });
    }

    // Periksa kepemilikan Pokja
    if (user.peran === 'pengurus_pokja' && targetKegiatan.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak mengubah dokumentasi milik Pokja Anda.' });
    }

    const updatedPokja = (user.peran === 'pengurus_pokja') ? user.pokja_id : (pokja_id ? Number(pokja_id) : targetKegiatan.pokja_id);

    if (dbService.isPostgres()) {
      const query = `
        UPDATE kegiatan SET
          judul = COALESCE($1, judul),
          tanggal = COALESCE($2, tanggal),
          pokja_id = $3,
          ringkasan = COALESCE($4, ringkasan),
          lokasi = COALESCE($5, lokasi),
          jumlah_peserta = COALESCE($6, jumlah_peserta),
          tautan_sosmed = COALESCE($7, tautan_sosmed),
          status = COALESCE($8, status),
          foto_sampul = COALESCE($9, foto_sampul),
          diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      const resDb = await pool.query(query, [judul, tanggal, updatedPokja, ringkasan, lokasi, jumlah_peserta, tautan_sosmed, status, foto_sampul, id]);
      targetKegiatan = resDb.rows[0];
    } else {
      if (judul !== undefined) targetKegiatan.judul = judul;
      if (tanggal !== undefined) targetKegiatan.tanggal = tanggal;
      targetKegiatan.pokja_id = updatedPokja;
      if (ringkasan !== undefined) targetKegiatan.ringkasan = ringkasan;
      if (lokasi !== undefined) targetKegiatan.lokasi = lokasi;
      if (jumlah_peserta !== undefined) targetKegiatan.jumlah_peserta = Number(jumlah_peserta);
      if (tautan_sosmed !== undefined) targetKegiatan.tautan_sosmed = tautan_sosmed;
      if (status !== undefined) targetKegiatan.status = status;
      if (foto_sampul !== undefined) targetKegiatan.foto_sampul = foto_sampul;
      targetKegiatan.diperbarui_pada = new Date().toISOString();
    }

    dbService.tambahLog(user.id, user.nama, 'UPDATE', 'kegiatan', id, `Memperbarui dokumentasi: "${targetKegiatan.judul}"`);

    res.json({ pesan: 'Dokumentasi berhasil diperbarui.', data: targetKegiatan });
  } catch (err) {
    console.error('Error update kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui dokumentasi.' });
  }
});

// DELETE /api/kegiatan/:id - Hapus dokumentasi
router.delete('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);

    let target = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Kegiatan tidak ditemukan.' });
      target = check.rows[0];
    } else {
      target = dbService.store.kegiatan.find(k => k.id === id);
      if (!target) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Kegiatan tidak ditemukan.' });
    }

    if (user.peran === 'pengurus_pokja' && target.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak menghapus dokumentasi milik Pokja Anda.' });
    }

    if (dbService.isPostgres()) {
      await pool.query('DELETE FROM kegiatan WHERE id = $1', [id]);
    } else {
      const idx = dbService.store.kegiatan.findIndex(k => k.id === id);
      if (idx !== -1) dbService.store.kegiatan.splice(idx, 1);
    }

    dbService.tambahLog(user.id, user.nama, 'DELETE', 'kegiatan', id, `Menghapus dokumentasi kegiatan: "${target.judul}"`);

    res.json({ pesan: 'Dokumentasi berhasil dihapus.' });
  } catch (err) {
    console.error('Error delete kegiatan:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menghapus dokumentasi.' });
  }
});

module.exports = router;
