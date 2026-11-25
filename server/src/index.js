const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dbService = require('./services/dbService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sajikan folder uploads secara statis
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root info
app.get('/api', (req, res) => {
  res.json({
    aplikasi: 'KADAYA (Kapasmadya Berdaya) API',
    deskripsi: 'Sistem Informasi PKK Kelurahan Kapasmadya Baru, Surabaya - Mendukung SDGs 5 (Kesetaraan Gender)',
    versi: '1.0.0',
    mode_database: dbService.isPostgres() ? 'PostgreSQL' : 'Smart In-Memory Store'
  });
});

// Pemasangan Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/publik', require('./routes/publik'));
app.use('/api/kegiatan', require('./routes/kegiatan'));
app.use('/api/produk', require('./routes/produk'));
app.use('/api/jadwal', require('./routes/jadwal'));
app.use('/api/admin', require('./routes/admin'));

// Penangan 404
app.use((req, res) => {
  res.status(404).json({
    kode: 'RUTE_TIDAK_DITEMUKAN',
    pesan: `Rute ${req.method} ${req.url} tidak ditemukan di server KADAYA.`
  });
});

// Penangan Galat Global
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    kode: 'SERVER_ERROR',
    pesan: err.message || 'Terjadi kesalahan internal pada server KADAYA.'
  });
});

// Inisialisasi DB & Jalankan Server
dbService.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌸 KADAYA Server berjalan di http://localhost:${PORT}`);
    console.log(`🌸 Mode DB: ${dbService.isPostgres() ? 'PostgreSQL (Live)' : 'In-Memory Store (Dev & Testing)'}`);
    console.log(`🌸 Mendukung SDGs 5: Kesetaraan Gender PKK Kapasmadya`);
    console.log(`=======================================================`);
  });
});
