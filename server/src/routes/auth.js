const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');
const { verifikasiToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/masuk
router.post('/masuk', async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;

    if (!email || !kata_sandi) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Email dan kata sandi wajib diisi.'
      });
    }

    const pengguna = await dbService.cariPenggunaByEmail(email);
    if (!pengguna) {
      return res.status(401).json({
        kode: 'LOGIN_GAGAL',
        pesan: 'Email atau kata sandi yang Anda masukkan salah.'
      });
    }

    if (!pengguna.aktif) {
      return res.status(401).json({
        kode: 'AKUN_NONAKTIF',
        pesan: 'Akun ini telah dinonaktifkan oleh Admin Kelurahan.'
      });
    }

    const cocok = await bcrypt.compare(kata_sandi, pengguna.password_hash);
    if (!cocok) {
      return res.status(401).json({
        kode: 'LOGIN_GAGAL',
        pesan: 'Email atau kata sandi yang Anda masukkan salah.'
      });
    }

    const payload = {
      id: pengguna.id,
      nama: pengguna.nama,
      email: pengguna.email,
      peran: pengguna.peran,
      pokja_id: pengguna.pokja_id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Catat log
    dbService.tambahLog(pengguna.id, pengguna.nama, 'LOGIN', 'auth', pengguna.id, `Pengguna masuk ke sistem (${pengguna.peran})`);

    // Kembalikan profil tanpa password_hash
    const { password_hash, ...profil } = pengguna;

    res.json({
      pesan: 'Berhasil masuk ke KADAYA.',
      token,
      pengguna: profil
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/auth/saya
router.get('/saya', verifikasiToken, async (req, res) => {
  try {
    const user = req.pengguna;
    let pokjaInfo = null;
    if (user.pokja_id) {
      const pokjas = await dbService.getPokjaList();
      pokjaInfo = pokjas.find(p => p.id === user.pokja_id) || null;
    }
    res.json({
      pengguna: {
        ...user,
        pokja: pokjaInfo
      }
    });
  } catch (err) {
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal mengambil data profil.' });
  }
});

// POST /api/auth/keluar
router.post('/keluar', (req, res) => {
  res.json({ pesan: 'Berhasil keluar.' });
});

// PATCH /api/auth/sandi
router.patch('/sandi', verifikasiToken, async (req, res) => {
  try {
    const { sandi_lama, sandi_baru, konfirmasi_sandi } = req.body;

    if (!sandi_baru || sandi_baru.length < 8) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Kata sandi baru minimal harus 8 karakter.'
      });
    }

    if (sandi_baru !== konfirmasi_sandi) {
      return res.status(422).json({
        kode: 'VALIDASI_GAGAL',
        pesan: 'Konfirmasi kata sandi baru tidak cocok.'
      });
    }

    // Ambil pengguna lengkap untuk cek password_hash
    const fullUser = await dbService.cariPenggunaByEmail(req.pengguna.email);
    if (!fullUser) {
      return res.status(404).json({ kode: 'TIDAK_DITEMUKAN', pesan: 'Pengguna tidak ditemukan.' });
    }

    // Jika bukan wajib ganti sandi awal, wajib cek sandi lama
    if (!req.pengguna.wajib_ganti_sandi) {
      if (!sandi_lama) {
        return res.status(422).json({ kode: 'VALIDASI_GAGAL', pesan: 'Kata sandi lama wajib diisi.' });
      }
      const match = await bcrypt.compare(sandi_lama, fullUser.password_hash);
      if (!match) {
        return res.status(422).json({ kode: 'SANDI_LAMA_SALAH', pesan: 'Kata sandi lama yang Anda masukkan salah.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(sandi_baru, salt);

    await dbService.ubahSandiPengguna(req.pengguna.id, newHash, false);

    dbService.tambahLog(req.pengguna.id, req.pengguna.nama, 'UPDATE_PASSWORD', 'pengguna', req.pengguna.id, 'Mengubah kata sandi akun');

    res.json({ pesan: 'Kata sandi berhasil diperbarui.' });
  } catch (err) {
    console.error('Error ubah sandi:', err);
    res.status(500).json({ kode: 'SERVER_ERROR', pesan: 'Gagal mengubah kata sandi.' });
  }
});

module.exports = router;
