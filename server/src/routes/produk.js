const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const { verifikasiToken } = require('../middleware/auth');
const { pool } = require('../config/db');

router.use(verifikasiToken);

// GET /api/produk - Daftar produk untuk dashboard
router.get('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let pokjaFilter = req.query.pokja_id ? Number(req.query.pokja_id) : null;

    if (user.peran === 'pengurus_pokja') {
      pokjaFilter = user.pokja_id;
    }

    if (dbService.isPostgres()) {
      let query = `
        SELECT pr.*, p.nama AS pokja_nama, p.warna_heksadesimal AS pokja_warna
        FROM produk pr
        JOIN pokja p ON pr.pokja_id = p.id
      `;
      let params = [];
      if (pokjaFilter) {
        query += ' WHERE pr.pokja_id = $1';
        params.push(pokjaFilter);
      }
      query += ' ORDER BY pr.id DESC';
      const result = await pool.query(query, params);
      return res.json({ data: result.rows });
    }

    let list = [...dbService.store.produk];
    if (pokjaFilter) {
      list = list.filter(pr => pr.pokja_id === pokjaFilter);
    }
    list.sort((a, b) => b.id - a.id);
    const data = list.map(pr => {
      const p = dbService.store.pokja.find(x => x.id === pr.pokja_id);
      return {
        ...pr,
        pokja_nama: p ? p.nama : '',
        pokja_warna: p ? p.warna_heksadesimal : '#2563EB'
      };
    });

    res.json({ data });
  } catch (err) {
    console.error('Error get produk dashboard:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memuat produk.' });
  }
});

// POST /api/produk - Tambah produk UMKM (Wajib sertakan nama pemilik & nomor kontak WhatsApp)
router.post('/', async (req, res) => {
  try {
    const user = req.pengguna;
    let { nama, pokja_id, deskripsi, harga, satuan, foto_url, nama_pemilik, no_telepon, alamat_pemilik } = req.body;

    if (user.peran === 'pengurus_pokja') {
      pokja_id = user.pokja_id;
    }

    if (!nama || !pokja_id || !nama_pemilik || !no_telepon) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Nama produk, Pokja, Nama pemilik (ibu pengrajin), dan Nomor telepon/WhatsApp wajib diisi.'
      });
    }

    const finalHarga = Number(harga) || 0;
    const finalFoto = foto_url || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80';

    let itemBaru;
    if (dbService.isPostgres()) {
      const query = `
        INSERT INTO produk (nama, pokja_id, pengguna_id, deskripsi, harga, satuan, foto_url, nama_pemilik, no_telepon, alamat_pemilik, tersedia)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        RETURNING *
      `;
      const result = await pool.query(query, [
        nama,
        Number(pokja_id),
        user.id,
        deskripsi || null,
        finalHarga,
        satuan || 'pcs',
        finalFoto,
        nama_pemilik,
        no_telepon,
        alamat_pemilik || null
      ]);
      itemBaru = result.rows[0];
    } else {
      dbService.counters.produk += 1;
      itemBaru = {
        id: dbService.counters.produk,
        nama,
        pokja_id: Number(pokja_id),
        pengguna_id: user.id,
        deskripsi: deskripsi || null,
        harga: finalHarga,
        satuan: satuan || 'pcs',
        foto_url: finalFoto,
        nama_pemilik,
        no_telepon,
        alamat_pemilik: alamat_pemilik || null,
        tersedia: true,
        dibuat_pada: new Date().toISOString()
      };
      dbService.store.produk.unshift(itemBaru);
    }

    dbService.tambahLog(user.id, user.nama, 'CREATE', 'produk', itemBaru.id, `Menambahkan produk UMKM: "${nama}" karya ${nama_pemilik}`);

    res.status(201).json({ pesan: 'Produk berhasil ditambahkan ke etalase KADAYA.', data: itemBaru });
  } catch (err) {
    console.error('Error tambah produk:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menambahkan produk.' });
  }
});

// PATCH /api/produk/:id - Ubah produk
router.patch('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);
    const { nama, pokja_id, deskripsi, harga, satuan, foto_url, nama_pemilik, no_telepon, alamat_pemilik, tersedia } = req.body;

    let target = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM produk WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Produk tidak ditemukan.' });
      target = check.rows[0];
    } else {
      target = dbService.store.produk.find(pr => pr.id === id);
      if (!target) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Produk tidak ditemukan.' });
    }

    if (user.peran === 'pengurus_pokja' && target.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak mengelola produk milik Pokja Anda.' });
    }

    const updatedPokja = (user.peran === 'pengurus_pokja') ? user.pokja_id : (pokja_id ? Number(pokja_id) : target.pokja_id);

    if (dbService.isPostgres()) {
      const query = `
        UPDATE produk SET
          nama = COALESCE($1, nama),
          pokja_id = $2,
          deskripsi = COALESCE($3, deskripsi),
          harga = COALESCE($4, harga),
          satuan = COALESCE($5, satuan),
          foto_url = COALESCE($6, foto_url),
          nama_pemilik = COALESCE($7, nama_pemilik),
          no_telepon = COALESCE($8, no_telepon),
          alamat_pemilik = COALESCE($9, alamat_pemilik),
          tersedia = COALESCE($10, tersedia),
          diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *
      `;
      const resDb = await pool.query(query, [
        nama, updatedPokja, deskripsi, harga, satuan, foto_url, nama_pemilik, no_telepon, alamat_pemilik, tersedia, id
      ]);
      target = resDb.rows[0];
    } else {
      if (nama !== undefined) target.nama = nama;
      target.pokja_id = updatedPokja;
      if (deskripsi !== undefined) target.deskripsi = deskripsi;
      if (harga !== undefined) target.harga = Number(harga);
      if (satuan !== undefined) target.satuan = satuan;
      if (foto_url !== undefined) target.foto_url = foto_url;
      if (nama_pemilik !== undefined) target.nama_pemilik = nama_pemilik;
      if (no_telepon !== undefined) target.no_telepon = no_telepon;
      if (alamat_pemilik !== undefined) target.alamat_pemilik = alamat_pemilik;
      if (tersedia !== undefined) target.tersedia = Boolean(tersedia);
    }

    dbService.tambahLog(user.id, user.nama, 'UPDATE', 'produk', id, `Memperbarui data produk UMKM: "${target.nama}"`);

    res.json({ pesan: 'Data produk berhasil diperbarui.', data: target });
  } catch (err) {
    console.error('Error update produk:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal memperbarui produk.' });
  }
});

// DELETE /api/produk/:id - Hapus produk
router.delete('/:id', async (req, res) => {
  try {
    const user = req.pengguna;
    const id = Number(req.params.id);

    let target = null;
    if (dbService.isPostgres()) {
      const check = await pool.query('SELECT * FROM produk WHERE id = $1', [id]);
      if (check.rows.length === 0) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Produk tidak ditemukan.' });
      target = check.rows[0];
    } else {
      target = dbService.store.produk.find(pr => pr.id === id);
      if (!target) return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Produk tidak ditemukan.' });
    }

    if (user.peran === 'pengurus_pokja' && target.pokja_id !== user.pokja_id) {
      return res.status(403).json({ kode: 'FORBIDDEN', pesan: 'Anda hanya berhak menghapus produk milik Pokja Anda.' });
    }

    if (dbService.isPostgres()) {
      await pool.query('DELETE FROM produk WHERE id = $1', [id]);
    } else {
      const idx = dbService.store.produk.findIndex(pr => pr.id === id);
      if (idx !== -1) dbService.store.produk.splice(idx, 1);
    }

    dbService.tambahLog(user.id, user.nama, 'DELETE', 'produk', id, `Menghapus produk UMKM: "${target.nama}"`);

    res.json({ pesan: 'Produk berhasil dihapus.' });
  } catch (err) {
    console.error('Error delete produk:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal menghapus produk.' });
  }
});

module.exports = router;
