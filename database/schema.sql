-- ====================================================================
-- KADAYA (Kapasmadya Berdaya) - PostgreSQL Database Schema
-- Mendukung SDGs 5: Kesetaraan Gender & Pemberdayaan Perempuan PKK
-- ====================================================================

-- 1. Ekstensi untuk pencarian teks trigram (opsional bila didukung)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Hapus tabel jika sudah ada (urutan child ke parent)
DROP VIEW IF EXISTS v_statistik_bulanan CASCADE;
DROP VIEW IF EXISTS v_statistik_pokja CASCADE;
DROP VIEW IF EXISTS v_kegiatan_publik CASCADE;
DROP TABLE IF EXISTS log_aktivitas CASCADE;
DROP TABLE IF EXISTS pesan_kontak CASCADE;
DROP TABLE IF EXISTS pengumuman CASCADE;
DROP TABLE IF EXISTS jadwal CASCADE;
DROP TABLE IF EXISTS produk CASCADE;
DROP TABLE IF EXISTS kegiatan_foto CASCADE;
DROP TABLE IF EXISTS kegiatan CASCADE;
DROP TABLE IF EXISTS profil_pengurus CASCADE;
DROP TABLE IF EXISTS pengguna CASCADE;
DROP TABLE IF EXISTS pokja CASCADE;

-- 3. Tabel Master Pokja (I s.d. IV)
CREATE TABLE pokja (
    id INT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL,
    singkatan VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    warna_heksadesimal VARCHAR(10) NOT NULL,
    warna_teks VARCHAR(10) NOT NULL DEFAULT '#ffffff',
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Pengguna (Admin & Pengurus Pokja)
CREATE TABLE pengguna (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    peran VARCHAR(30) NOT NULL CHECK (peran IN ('admin', 'pengurus_pokja')),
    pokja_id INT REFERENCES pokja(id) ON DELETE SET NULL,
    wajib_ganti_sandi BOOLEAN DEFAULT FALSE,
    aktif BOOLEAN DEFAULT TRUE,
    terakhir_masuk TIMESTAMP WITH TIME ZONE,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_pengurus_pokja CHECK (
        (peran = 'admin') OR (peran = 'pengurus_pokja' AND pokja_id IS NOT NULL)
    )
);

-- 5. Tabel Profil Pengurus PKK (Struktur Organisasi yang Tampil di Web)
CREATE TABLE profil_pengurus (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    pokja_id INT REFERENCES pokja(id) ON DELETE SET NULL, -- NULL jika Pengurus Inti (Ketua, Sekretaris, Bendahara)
    periode VARCHAR(50) DEFAULT '2024 - 2029',
    foto_url TEXT,
    urutan INT DEFAULT 1,
    aktif BOOLEAN DEFAULT TRUE,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Kegiatan Pokja (Dokumentasi Seragam)
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    pokja_id INT NOT NULL REFERENCES pokja(id) ON DELETE RESTRICT,
    pengguna_id INT REFERENCES pengguna(id) ON DELETE SET NULL,
    ringkasan TEXT,
    lokasi VARCHAR(255),
    jumlah_peserta INT DEFAULT 0 CHECK (jumlah_peserta >= 0),
    tautan_sosmed TEXT,
    status VARCHAR(20) DEFAULT 'terbit' CHECK (status IN ('draft', 'terbit', 'disembunyikan')),
    foto_sampul TEXT,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Foto Dokumentasi Kegiatan
CREATE TABLE kegiatan_foto (
    id SERIAL PRIMARY KEY,
    kegiatan_id INT NOT NULL REFERENCES kegiatan(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    keterangan VARCHAR(255),
    adalah_sampul BOOLEAN DEFAULT FALSE,
    urutan INT DEFAULT 1,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Produk UMKM Binaan PKK (Etalase Non-Transaksi - SDGs 5)
CREATE TABLE produk (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    pokja_id INT NOT NULL REFERENCES pokja(id) ON DELETE RESTRICT,
    pengguna_id INT REFERENCES pengguna(id) ON DELETE SET NULL,
    deskripsi TEXT,
    harga NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (harga >= 0),
    satuan VARCHAR(50) DEFAULT 'porsi/pcs',
    foto_url TEXT,
    nama_pemilik VARCHAR(150) NOT NULL,     -- Nama Ibu pengrajin/pemilik produk UMKM
    no_telepon VARCHAR(50) NOT NULL,       -- Nomor WhatsApp/HP pemilik produk
    alamat_pemilik VARCHAR(255),           -- Domisili/RT di Kelurahan Kapasmadya Baru
    tersedia BOOLEAN DEFAULT TRUE,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabel Jadwal & Agenda
CREATE TABLE jadwal (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    waktu_mulai TIME,
    waktu_selesai TIME,
    lokasi VARCHAR(255),
    pokja_id INT REFERENCES pokja(id) ON DELETE SET NULL, -- NULL = Seluruh Pokja / Pleno
    kegiatan_id INT REFERENCES kegiatan(id) ON DELETE SET NULL, -- Tautan jika kegiatan sudah terdokumentasi
    keterangan TEXT,
    status VARCHAR(20) DEFAULT 'akan_datang' CHECK (status IN ('akan_datang', 'selesai', 'dibatalkan')),
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel Pengumuman Warga
CREATE TABLE pengumuman (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    penting BOOLEAN DEFAULT FALSE,
    tayang_mulai DATE NOT NULL,
    tayang_sampai DATE NOT NULL,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabel Pesan Masuk & Permintaan Informasi / Pesanan Produk
CREATE TABLE pesan_kontak (
    id SERIAL PRIMARY KEY,
    nama_pengirim VARCHAR(150) NOT NULL,
    kontak_pengirim VARCHAR(150) NOT NULL, -- Nomor WhatsApp atau email pengirim
    jenis VARCHAR(50) NOT NULL CHECK (jenis IN ('pertanyaan', 'pesanan_produk', 'relawan', 'lainnya')),
    produk_id INT REFERENCES produk(id) ON DELETE SET NULL,
    pesan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'baru' CHECK (status IN ('baru', 'dibaca', 'dibalas', 'selesai')),
    catatan_admin TEXT,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tabel Log Audit Aktivitas
CREATE TABLE log_aktivitas (
    id SERIAL PRIMARY KEY,
    pengguna_id INT REFERENCES pengguna(id) ON DELETE SET NULL,
    aksi VARCHAR(100) NOT NULL,
    entitas VARCHAR(50) NOT NULL,
    entitas_id INT,
    rincian TEXT,
    dibuat_pada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Indeks Performa
-- ====================================================================
CREATE INDEX idx_kegiatan_pokja_tanggal ON kegiatan(pokja_id, tanggal DESC);
CREATE INDEX idx_kegiatan_tanggal ON kegiatan(tanggal DESC);
CREATE INDEX idx_kegiatan_status ON kegiatan(status);
CREATE INDEX idx_produk_pokja ON produk(pokja_id);
CREATE INDEX idx_jadwal_tanggal ON jadwal(tanggal ASC);
CREATE INDEX idx_pengumuman_tayang ON pengumuman(tayang_mulai, tayang_sampai);

-- ====================================================================
-- VIEW Database
-- ====================================================================

-- View Kegiatan Publik (hanya yang statusnya 'terbit')
CREATE OR REPLACE VIEW v_kegiatan_publik AS
SELECT 
    k.id,
    k.judul,
    k.tanggal,
    k.pokja_id,
    p.nama AS pokja_nama,
    p.singkatan AS pokja_singkatan,
    p.warna_heksadesimal AS pokja_warna,
    k.ringkasan,
    k.lokasi,
    k.jumlah_peserta,
    k.tautan_sosmed,
    k.foto_sampul,
    k.dibuat_pada
FROM kegiatan k
JOIN pokja p ON k.pokja_id = p.id
WHERE k.status = 'terbit';

-- View Statistik Capaian per Pokja
CREATE OR REPLACE VIEW v_statistik_pokja AS
SELECT 
    p.id AS pokja_id,
    p.nama AS pokja_nama,
    p.singkatan AS pokja_singkatan,
    p.warna_heksadesimal AS pokja_warna,
    COUNT(DISTINCT k.id) FILTER (WHERE k.status = 'terbit') AS total_kegiatan,
    COALESCE(SUM(k.jumlah_peserta) FILTER (WHERE k.status = 'terbit'), 0) AS total_peserta,
    COUNT(DISTINCT pr.id) FILTER (WHERE pr.tersedia = true) AS total_produk
FROM pokja p
LEFT JOIN kegiatan k ON p.id = k.pokja_id
LEFT JOIN produk pr ON p.id = pr.pokja_id
GROUP BY p.id, p.nama, p.singkatan, p.warna_heksadesimal;

-- View Statistik Bulanan (Kegiatan & Peserta 12 Bulan Terakhir)
CREATE OR REPLACE VIEW v_statistik_bulanan AS
SELECT 
    TO_CHAR(k.tanggal, 'YYYY-MM') AS bulan_tahun,
    TO_CHAR(k.tanggal, 'Mon YYYY') AS label_bulan,
    COUNT(k.id) AS jumlah_kegiatan,
    COALESCE(SUM(k.jumlah_peserta), 0) AS total_peserta
FROM kegiatan k
WHERE k.status = 'terbit'
GROUP BY TO_CHAR(k.tanggal, 'YYYY-MM'), TO_CHAR(k.tanggal, 'Mon YYYY')
ORDER BY bulan_tahun DESC
LIMIT 12;
