const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const JWT_SECRET = process.env.JWT_SECRET || 'kadaya_rahasia_super_aman_sdgs5_pkk_kapasmadya_2026';

// Middleware verifikasi token JWT
async function verifikasiToken(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        kode: 'UNAUTHORIZED',
        pesan: 'Sesi tidak ditemukan atau kedaluwarsa. Silakan masuk terlebih dahulu.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const pengguna = await dbService.cariPenggunaById(decoded.id);

    if (!pengguna || !pengguna.aktif) {
      return res.status(401).json({
        kode: 'AKUN_NONAKTIF',
        pesan: 'Akun Anda tidak aktif atau tidak ditemukan. Hubungi Admin Kelurahan.'
      });
    }

    req.pengguna = pengguna;
    next();
  } catch (err) {
    return res.status(401).json({
      kode: 'TOKEN_INVALID',
      pesan: 'Sesi tidak valid atau telah berakhir. Silakan masuk kembali.'
    });
  }
}

// Middleware pemeriksaan peran
function cekPeran(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.pengguna) {
      return res.status(401).json({ kode: 'UNAUTHORIZED', pesan: 'Silakan masuk terlebih dahulu.' });
    }
    if (!allowed.includes(req.pengguna.peran)) {
      return res.status(403).json({
        kode: 'FORBIDDEN',
        pesan: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.'
      });
    }
    next();
  };
}

// Pemeriksaan hak kelola Pokja (Pengurus Pokja hanya boleh mengelola Pokjanya sendiri)
function cekKepemilikanPokja(getPokjaIdFromReq) {
  return (req, res, next) => {
    if (!req.pengguna) {
      return res.status(401).json({ kode: 'UNAUTHORIZED', pesan: 'Silakan masuk terlebih dahulu.' });
    }
    // Admin memiliki hak akses penuh ke seluruh Pokja
    if (req.pengguna.peran === 'admin') {
      return next();
    }

    const targetPokjaId = typeof getPokjaIdFromReq === 'function' ? getPokjaIdFromReq(req) : req.body.pokja_id || req.params.pokja_id;

    if (!targetPokjaId || Number(targetPokjaId) !== Number(req.pengguna.pokja_id)) {
      return res.status(403).json({
        kode: 'HAK_AKSES_POKJA_DITOLAK',
        pesan: `Anda hanya memiliki hak akses untuk mengelola data Pokja ${req.pengguna.pokja_id}.`
      });
    }
    next();
  };
}

module.exports = {
  verifikasiToken,
  cekPeran,
  cekKepemilikanPokja,
  JWT_SECRET
};
