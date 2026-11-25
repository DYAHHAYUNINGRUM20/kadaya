-- ====================================================================
-- KADAYA (Kapasmadya Berdaya) - PostgreSQL Database Seed Data
-- Data Dummy Realistis PKK Kelurahan Kapasmadya Baru, Surabaya
-- ====================================================================

-- 1. Master Pokja
INSERT INTO pokja (id, nama, singkatan, deskripsi, warna_heksadesimal, warna_teks) VALUES
(1, 'Pokja I', 'Penghayatan & Gotong Royong', 'Pembinaan mental spiritual, pola asuh anak & remaja (PAAR), kesadaran hukum, dan semangat gotong royong warga.', '#2563EB', '#ffffff'),
(2, 'Pokja II', 'Pendidikan & Keterampilan', 'Peningkatan pendidikan keluarga, literasi digital, pemberdayaan ekonomi perempuan melalui UP2K (Usaha Peningkatan Pendapatan Keluarga).', '#DB2777', '#ffffff'),
(3, 'Pokja III', 'Penguatan Ketahanan Pangan', 'Pemanfaatan pekarangan (AKU HATINYA PKK), pangan Beragam, Bergizi, Seimbang dan Aman (B2SA), serta tata laksana rumah tangga.', '#0284C7', '#ffffff'),
(4, 'Pokja IV', 'Kesehatan & Lingkungan', 'Pelayanan Posyandu, pencegahan stunting, kelestarian lingkungan hidup, serta perencanaan keluarga sehat berkualitas.', '#E11D48', '#ffffff')
ON CONFLICT (id) DO UPDATE SET
    nama = EXCLUDED.nama,
    singkatan = EXCLUDED.singkatan,
    deskripsi = EXCLUDED.deskripsi,
    warna_heksadesimal = EXCLUDED.warna_heksadesimal;

-- 2. Pengguna (Admin & Pengurus Pokja I-IV)
-- Password Admin#2026: $2a$10$RFCFuoRNIsqKw7lRLP6p..2sNbKEjwTYbMD640hmlEaTdTA9ORWXG
-- Password Pokja#2026: $2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m
INSERT INTO pengguna (id, nama, email, password_hash, peran, pokja_id, wajib_ganti_sandi, aktif) VALUES
(1, 'Admin Kelurahan Kapasmadya Baru', 'admin@kadaya.local', '$2a$10$RFCFuoRNIsqKw7lRLP6p..2sNbKEjwTYbMD640hmlEaTdTA9ORWXG', 'admin', NULL, false, true),
(2, 'Mbak Hilwa Nabila (PIC Pokja I)', 'pokja1@kadaya.local', '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', 'pengurus_pokja', 1, false, true),
(3, 'Ibu Tri Astuti (PIC Pokja II)', 'pokja2@kadaya.local', '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', 'pengurus_pokja', 2, false, true),
(4, 'Ibu Nurul Aini (PIC Pokja III)', 'pokja3@kadaya.local', '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', 'pengurus_pokja', 3, false, true),
(5, 'Bidan Dewi Lestari (PIC Pokja IV)', 'pokja4@kadaya.local', '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', 'pengurus_pokja', 4, false, true)
ON CONFLICT (id) DO UPDATE SET
    nama = EXCLUDED.nama,
    password_hash = EXCLUDED.password_hash;

SELECT setval('pengguna_id_seq', (SELECT MAX(id) FROM pengguna));

-- 3. Profil Pengurus PKK (Struktur Tampil)
INSERT INTO profil_pengurus (id, nama, jabatan, pokja_id, periode, foto_url, urutan, aktif) VALUES
(1, 'Ny. Hj. Endang Rahayu, S.Pd', 'Ketua Tim Penggerak PKK', NULL, '2024 - 2029', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', 1, true),
(2, 'Ny. Hj. Masitah, M.M', 'Wakil Ketua TP PKK', NULL, '2024 - 2029', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 2, true),
(3, 'Hilwa Nabila, S.Kom', 'Sekretaris PKK', NULL, '2024 - 2029', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80', 3, true),
(4, 'Siti Khotimah, S.E', 'Bendahara PKK', NULL, '2024 - 2029', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', 4, true),
(5, 'Dra. Hj. Sri Wahyuni', 'Ketua Pokja I', 1, '2024 - 2029', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', 5, true),
(6, 'Tri Astuti, S.Pd', 'Ketua Pokja II', 2, '2024 - 2029', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80', 6, true),
(7, 'Nurul Aini', 'Ketua Pokja III', 3, '2024 - 2029', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', 7, true),
(8, 'Bidan Dewi Lestari, Amd.Keb', 'Ketua Pokja IV', 4, '2024 - 2029', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', 8, true)
ON CONFLICT (id) DO NOTHING;

SELECT setval('profil_pengurus_id_seq', (SELECT MAX(id) FROM profil_pengurus));

-- 4. Kegiatan Pokja
INSERT INTO kegiatan (id, judul, tanggal, pokja_id, pengguna_id, ringkasan, lokasi, jumlah_peserta, tautan_sosmed, status, foto_sampul) VALUES
(1, 'Pelatihan Pola Asuh Anak & Remaja di Era Digital (PAAR Cinta)', '2026-11-15', 1, 2, 'Pembinaan ibu-ibu PKK terkait pendampingan penggunaan gawai cerdas pada anak serta penguatan nilai keagamaan dalam keluarga.', 'Balai RW 03 Kapasmadya Baru', 45, 'https://instagram.com/pkk_kapasmadya', 'terbit', 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80'),
(2, 'Simulasi & Gerakan Gotong Royong Lansia Produktif', '2026-11-02', 1, 2, 'Kunjungan kasih dan pendampingan lansia berdaya sekaligus kerja bakti membersihkan lingkungan balai pertemuan.', 'Balai Pertemuan RW 01', 32, 'https://facebook.com/pkk.kapasmadya', 'terbit', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80'),
(3, 'Workshop Pembuatan Kemasan & Digital Marketing UP2K PKK', '2026-11-18', 2, 3, 'Meningkatkan nilai jual karya UMKM ibu-ibu PKK dengan pelatihan desain label kemasan higienis dan teknik foto produk smartphone.', 'Ruang Rapat Kelurahan Kapasmadya Baru', 28, 'https://instagram.com/pkk_kapasmadya', 'terbit', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'),
(4, 'Pelatihan Kerajinan Tas Rajut Daur Ulang & Ecoprint Daun Lokal', '2026-10-24', 2, 3, 'Pemberdayaan keterampilan perempuan dalam mengolah kain blacu dengan teknik ecoprint daun jati serta anyaman ramah lingkungan.', 'Rumah Kreatif Pokja II (RW 04)', 25, NULL, 'terbit', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80'),
(5, 'Pemanfaatan Lahan Pekarangan', '2026-05-25', 3, 4, 'Kegiatan bersama Ketua TP PKK Kelurahan Kapasmadya Baru dalam mengoptimalkan lahan pekarangan melalui penanaman tanaman pangan, Tanaman Obat Keluarga (TOGA), dan tanaman hias untuk mendukung ketahanan pangan serta menciptakan lingkungan yang asri dan produktif.', 'Kelurahan Kapasmadya Baru', NULL, 'https://www.instagram.com/p/DYySG3NDyXb/', 'terbit', '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg'),
(6, 'Lomba Menu Kudapan B2SA Pencegah Anemia bagi Remaja Putri', '2026-10-14', 3, 4, 'Lomba olahan makanan berbasis kelor dan singkong lokal antar perwakilan RT se-Kelurahan Kapasmadya Baru.', 'Pendopo Kelurahan', 35, NULL, 'terbit', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80'),
(7, 'Posyandu Terintegrasi ILP (Integrasi Layanan Primer) Balita & Lansia', '2026-11-20', 4, 5, 'Pemeriksaan tensi, gula darah, berat-tinggi badan, pemberian vitamin A, PMT berbahan telur & susu untuk mencegah stunting.', 'Poskeskel Kapasmadya Baru', 65, 'https://instagram.com/pkk_kapasmadya', 'terbit', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80'),
(8, 'Gerakan PSN (Pemberantasan Sarang Nyamuk) Serentak Bebas DBD', '2026-11-08', 4, 5, 'Pemeriksaan jentik berkala oleh kader Jumantik ibu-ibu PKK dari rumah ke rumah warga RW 01 sampai RW 05.', 'Wilayah RW 01 - RW 05', 50, NULL, 'terbit', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80')
ON CONFLICT (id) DO NOTHING;

SELECT setval('kegiatan_id_seq', (SELECT MAX(id) FROM kegiatan));

-- 5. Foto Galeri Kegiatan
INSERT INTO kegiatan_foto (id, kegiatan_id, url, keterangan, adalah_sampul, urutan) VALUES
(1, 1, 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80', 'Suasana pemaparan materi parenting digital', true, 1),
(2, 1, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', 'Sesi tanya jawab interaktif ibu-ibu warga', false, 2),
(3, 3, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', 'Praktik desain kemasan produk UMKM UP2K', true, 1),
(4, 5, '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg', 'Dokumentasi kegiatan Pemanfaatan Lahan Pekarangan, 25 Mei 2026', true, 1),
(5, 7, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80', 'Penimbangan balita oleh kader posyandu terlatih', true, 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('kegiatan_foto_id_seq', (SELECT MAX(id) FROM kegiatan_foto));

-- 6. Produk UMKM Binaan PKK (Etalase Non-Transaksi dengan Kontak Pemilik - SDGs 5)
INSERT INTO produk (id, nama, pokja_id, pengguna_id, deskripsi, harga, satuan, foto_url, nama_pemilik, no_telepon, alamat_pemilik, tersedia) VALUES
(1, 'Keripik Tempe Sagu Renyah Mba Siti', 2, 3, 'Keripik tempe sagu olahan rumahan khas Surabaya dengan rasa gurih renyah tanpa pengawet buatan. Cocok untuk cemilan keluarga dan oleh-oleh.', 15000, 'bungkus 250gr', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80', 'Ibu Siti Aminah (Kader UP2K)', '081234567891', 'RT 02 / RW 03, Kapasmadya Baru', true),
(2, 'Scarf Sutra Ecoprint Daun Jati & Jenitri', 2, 3, 'Kain scarf sutra motif ecoprint murni menggunakan dedaunan alami lokal Kapasmadya Baru. Pewarna alami kayu secang, sejuk dan elegan.', 120000, 'helai', '/images/scarf-sutra-ecoprint-daun-jati-jenitri.jpg', 'Ibu Tri Astuti (Pokja II)', '081398765432', 'RT 04 / RW 04, Kapasmadya Baru', true),
(3, 'Sambal Bajak Roa Uleg Tradisional', 3, 4, 'Sambal rumahan khas Suroboyo dengan cabai segar dan terasi bakar pilihan. Dikemas dalam toples segel higienis, tahan 1 bulan.', 25000, 'toples 180gr', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', 'Ibu Sri Mulyani', '085712348901', 'RT 05 / RW 01, Kapasmadya Baru', true),
(4, 'Sirup Bunga Telang Segar "Kebun Gizi"', 3, 4, 'Minuman herbal kaya antioksidan dari bunga telang segar hasil kebun hidroponik PKK Pokja III, dipadu serai dan gula tebu asli.', 18000, 'botol 250ml', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', 'Ibu Nurul Aini (Pokja III)', '081287654321', 'RT 01 / RW 02, Kapasmadya Baru', true),
(5, 'Tas Anyaman Daur Ulang Modis (Jali Premium)', 2, 3, 'Tas belanja dan bepergian modis berbahan anyaman jali daur ulang yang kuat, anti air, dan mudah dibersihkan. Membantu kurangi sampah plastik.', 45000, 'buah', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', 'Ibu Ratna Dewi', '087812345678', 'RT 03 / RW 02, Kapasmadya Baru', true),
(6, 'Jamu Beras Kencur & Kunyit Asam Segar', 4, 5, 'Minuman tradisional warisan leluhur dibuat dari rimpang pilihan berkhasiat menjaga kebugaran tubuh dan imunitas keluarga.', 12000, 'botol 350ml', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80', 'Ibu Warsini (Kader Posyandu)', '081345678910', 'RT 03 / RW 05, Kapasmadya Baru', true)
ON CONFLICT (id) DO NOTHING;

SELECT setval('produk_id_seq', (SELECT MAX(id) FROM produk));

-- 7. Jadwal & Agenda
INSERT INTO jadwal (id, judul, tanggal, waktu_mulai, waktu_selesai, lokasi, pokja_id, kegiatan_id, keterangan, status) VALUES
(1, 'Posyandu ILP Balita & Lansia Rutin RW 02', '2026-11-25', '08:00', '11:30', 'Balai RW 02 Kapasmadya Baru', 4, NULL, 'Penimbangan berat badan, imunisasi, dan konseling gizi pencegahan stunting.', 'akan_datang'),
(2, 'Rapat Koordinasi Pleno Bulanan Pengurus PKK', '2026-11-28', '15:30', '17:30', 'Pendopo Kelurahan Lt. 2', NULL, NULL, 'Evaluasi program kerja Pokja I-IV dan persiapan gebyar akhir tahun.', 'akan_datang'),
(3, 'Bazar Produk Olahan Pangan Lokal & Kerajinan UP2K', '2026-12-05', '07:00', '12:00', 'Halaman Kantor Kelurahan', 2, NULL, 'Pameran karya ibu-ibu PKK sekaligus etalase produk binaan KADAYA.', 'akan_datang'),
(4, 'Pemeriksaan Jentik & Kerja Bakti Kebersihan Lingkungan', '2026-12-10', '06:30', '09:00', 'Lingkungan RW 01 - 05', 4, NULL, 'Gerakan PSN bersama warga dan kader PKK.', 'akan_datang'),
(5, 'Aksi Panen Raya Sayur Hidroponik "AKU HATINYA PKK"', '2026-11-10', '08:00', '10:00', 'Kebun Gizi RW 02', 3, 5, 'Sudah terlaksana dengan sukses.', 'selesai')
ON CONFLICT (id) DO NOTHING;

SELECT setval('jadwal_id_seq', (SELECT MAX(id) FROM jadwal));

-- 8. Pengumuman
INSERT INTO pengumuman (id, judul, isi, penting, tayang_mulai, tayang_sampai) VALUES
(1, 'Jadwal Pemberian Vitamin A & Vaksinasi Balita Bulan November', 'Diberitahukan kepada seluruh ibu balita Kelurahan Kapasmadya Baru agar membawa buku KIA pada jadwal Posyandu terdekat untuk mendapatkan kapsul Vitamin A biru/merah secara gratis.', true, '2026-11-01', '2026-11-30'),
(2, 'Pendaftaran Terbuka Pelatihan Keterampilan Menjahit & Bordir', 'Pokja II PKK membuka kelas pelatihan keterampilan perempuan untuk 20 orang pendaftar warga Kapasmadya Baru. Gratis tanpa dipungut biaya. Hubungi Sekretariat PKK kelurahan.', false, '2026-11-15', '2026-12-05'),
(3, 'Etalase Karya KADAYA: Dukung Usaha Ibu-Ibu PKK Kita', 'Kini warga dapat melihat produk olahan makanan dan kerajinan tangan karya ibu-ibu PKK langsung di website KADAYA. Hubungi nomor WhatsApp pengrajin untuk pemesanan!', true, '2026-11-01', '2026-12-31')
ON CONFLICT (id) DO NOTHING;

SELECT setval('pengumuman_id_seq', (SELECT MAX(id) FROM pengumuman));

-- 9. Pesan Kontak Dummy
INSERT INTO pesan_kontak (id, nama_pengirim, kontak_pengirim, jenis, produk_id, pesan, status, catatan_admin) VALUES
(1, 'Rina Agustina', '081299887766', 'pesanan_produk', 1, 'Halo, saya ingin memesan Keripik Tempe Sagu Ibu Siti sebanyak 10 bungkus untuk acara keluarga hari Minggu depan. Apakah bisa diambil langsung ke rumah beliau?', 'dibaca', 'Diteruskan ke Bu Siti via WhatsApp'),
(2, 'Fajar Ramadhan', 'fajar.ramadhan@mhs.unesa.ac.id', 'relawan', NULL, 'Selamat siang ibu pengurus PKK, saya mahasiswa yang ingin menjadi relawan mengajar literasi digital untuk anak-anak di Pokok Bacaan RW 03. Bagaimana mekanismenya?', 'baru', NULL),
(3, 'Dewi Sartika', '085744332211', 'pertanyaan', NULL, 'Mohon info persyaratan untuk bergabung dalam kelompok UP2K binaan Pokja II apakah harus sudah memiliki produk sendiri?', 'dibalas', 'Dijawab via chat WA')
ON CONFLICT (id) DO NOTHING;

SELECT setval('pesan_kontak_id_seq', (SELECT MAX(id) FROM pesan_kontak));

-- 10. Log Aktivitas
INSERT INTO log_aktivitas (pengguna_id, aksi, entitas, entitas_id, rincian) VALUES
(1, 'SEEDED', 'sistem', 0, 'Inisialisasi data master dan dummy PKK Kelurahan Kapasmadya Baru'),
(2, 'CREATE', 'kegiatan', 1, 'Mbak Hilwa mengunggah dokumentasi: Pelatihan Pola Asuh Anak & Remaja'),
(3, 'CREATE', 'produk', 1, 'Ibu Tri Astuti menambahkan produk UMKM: Keripik Tempe Sagu'),
(4, 'CREATE', 'kegiatan', 5, 'Ibu Nurul Aini mengunggah dokumentasi: Panen Raya Sayur Hidroponik'),
(5, 'CREATE', 'kegiatan', 7, 'Bidan Dewi Lestari mengunggah dokumentasi: Posyandu Terintegrasi ILP');
