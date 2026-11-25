const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const { verifikasiToken } = require('../middleware/auth');
const { pool } = require('../config/db');

router.use(verifikasiToken);

// GET /api/jadwal - Daftar jadwal untuk dashboard
router.get('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let pokjaFilter = req.query.pokja_id ? Number(req.query.pokja_id) : null;

    if (user.peran === 'pengurus_pokja') {
      pokjaFilter = user.pokja_id;
    }

    if (dbService.isPostgres()) {
      let query = `
        SELECT j.*, p.nama AS pokja_nama, p.warna_heksadesimal AS pokja_warna
        FROM jadwal j
        LEFT JOIN pokja p ON j.pokja_id = p.id
      `;
      let params = [];
      if (pokjaFilter) {
        query += ' WHERE j.pokja_id = $1 OR j.pokja_id IS NULL';
        params.push(pokjaFilter);
      }
      query += ' ORDER BY j.tanggal ASC, j.waktu_mulai ASC';
      const result = await pool.query(query, params);
      return res.json({ data: result.rows });
    }

    let list = [...dbService.store.jadwal];
    if (pokjaFilter) {
      list = list.filter(j => j.pokja_id === pokjaFilter || j.pokja_id === null);
    }
    list.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    const data = list.map(j => {
      const p = dbService.store.pokja.find(x => x.id === j.pokja_id);
      return {
        ...j,
        pokja_nama: p ? p.nama : 'Semua Pokja / Pleno',
        pokja_warna: p ? p.warna_heksadesimal : '#2563EB'
      };
    });

    res.json({ data });
  } catch (err) {
    console.error('Error get jadwal dashboard:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat jadwal.' });
  }
});

// POST /api/jadwal - Tambah jadwal
router.post('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let { judul, tanggal, waktu_mulai, waktu_selesai, lokasi, pokja_id, keterangan, status } = req.body;

    if (user.peran === 'pengurus_pokja') {
      pokja_id = user.pokja_id;
    }

    if (!judul || !tanggal) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Judul kegiatan dan tanggal wajib diisi.'
      });
    }

    const finalStatus = status || 'akan_datang';
    const finalPokja = pokja_id ? Number(pokja_id) : null;

    let itemBaru;
    if (dbService.isPostgres()) {
      const query = `
        INSERT INTO jadwal (judul, tanggal, waktu_mulai, waktu_selesai, lokasi, pokja_id, keterangan, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const result = await pool.query(query, [
        judul, tanggal, waktu_mulai || null, waktu_selesai || null, lokasi || null, finalPokja, keterangan || null, finalStatus
      ]);
      itemBaru = result.rows[0];
    } else {
      dbService.counters.jadwal += 1;
      itemBaru = {
        id: dbService.counters.jadwal,
        judul,
        tanggal,
        waktu_mulai: waktu_mulai || null,
        waktu_selesai: waktu_selesai || null,
        lokasi: lokasi || null,
        pokja_id: finalPokja,
        kegiatan_id: null,
        keterangan: keterangan || null,
        status: finalStatus
      };
      dbService.store.jadwal.push(itemBaru);
    }

    dbService.tambahLog(user.id, user.nama, 'CREATE', 'jadwal', itemBaru.id, `Menambahkan agenda: "${judul}"`);

    res.status(201).json({ pesan: 'Jadwal berhasil ditambahkan.', data: itemBaru });
  } catch (err) {
    console.error('Error tambah jadwal:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menambahkan jadwal.' });
  }
});

// PATCH /api/jadwal/:id - Ubah jadwal
router.patch('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);
    const { judul, tanggal, waktu_mulai, waktu_selesai, lokasi, pokja_id, keterangan, status, kegiatan_id } = req.body;

    let target = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM jadwal WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Jadwal tidak ditemukan.' });
      target = check.rows[0];
    } else {
      target = dbService.store.jadwal.find(j => j.id === id);
      if (!target) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Jadwal tidak ditemukan.' });
    }

    if (user.peran === 'pengurus_pokja' && target.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak mengelola jadwal milik Pokja Anda.' });
    }

    if (dbService.isPostgres()) {
      const query = `
        UPDATE jadwal SET
          judul = COALESCE($1, judul),
          tanggal = COALESCE($2, tanggal),
          waktu_mulai = COALESCE($3, waktu_mulai),
          waktu_selesai = COALESCE($4, waktu_selesai),
          lokasi = COALESCE($5, lokasi),
          keterangan = COALESCE($6, keterangan),
          status = COALESCE($7, status),
          kegiatan_id = COALESCE($8, kegiatan_id)
        WHERE id = $9
        RETURNING *
      `;
      const resDb = await pool.query(query, [judul, tanggal, waktu_mulai, waktu_selesai, lokasi, keterangan, status, kegiatan_id, id]);
      target = resDb.rows[0];
    } else {
      if (judul !== undefined) target.judul = judul;
      if (tanggal !== undefined) target.tanggal = tanggal;
      if (waktu_mulai !== undefined) target.waktu_mulai = waktu_mulai;
      if (waktu_selesai !== undefined) target.waktu_selesai = waktu_selesai;
      if (lokasi !== undefined) target.lokasi = lokasi;
      if (keterangan !== undefined) target.keterangan = keterangan;
      if (status !== undefined) target.status = status;
      if (kegiatan_id !== undefined) target.kegiatan_id = kegiatan_id ? Number(kegiatan_id) : null;
    }

    dbService.tambahLog(user.id, user.nama, 'UPDATE', 'jadwal', id, `Memperbarui agenda: "${target.judul}"`);

    res.json({ pesan: 'Jadwal berhasil diperbarui.', data: target });
  } catch (err) {
    console.error('Error update jadwal:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui jadwal.' });
  }
});

// DELETE /api/jadwal/:id - Hapus jadwal
router.delete('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);

    let target = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM jadwal WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Jadwal tidak ditemukan.' });
      target = check.rows[0];
    } else {
      target = dbService.store.jadwal.find(j => j.id === id);
      if (!target) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Jadwal tidak ditemukan.' });
    }

    if (user.peran === 'pengurus_pokja' && target.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak menghapus jadwal milik Pokja Anda.' });
    }

    if (dbService.isPostgres()) {
      await pool.query('DELETE FROM jadwal WHERE id = $1', [id]);
    } else {
      const idx = dbService.store.jadwal.findIndex(j => j.id === id);
      if (idx !== -1) dbService.store.jadwal.splice(idx, 1);
    }

    dbService.tambahLog(user.id, user.nama, 'DELETE', 'jadwal', id, `Menghapus agenda: "${target.judul}"`);

    res.json({ pesan: 'Jadwal berhasil dihapus.' });
  } catch (err) {
    console.error('Error delete jadwal:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menghapus jadwal.' });
  }
});

module.exports = router;
