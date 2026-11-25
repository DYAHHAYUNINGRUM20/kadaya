const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let usePostgres = false;

// Memeriksa koneksi PostgreSQL saat inisialisasi
async function initDb() {
  try {
    const res = await pool.query('SELECT NOW()');
    usePostgres = true;
    console.log('[DB] Terhubung ke PostgreSQL:', res.rows[0].now);
  } catch (err) {
    usePostgres = false;
    console.warn('[DB] PostgreSQL tidak terdeteksi pada 5432 (' + err.message + '). Menggunakan Data Store Cerdas In-Memory untuk pengembangan & pengujian.');
  }
}

// Data seed bawaan (identik dengan database/seed.sql)
const defaultData = {
  pokja: [
    { id: 1, nama: 'Pokja I', singkatan: 'Penghayatan & Gotong Royong', deskripsi: 'Pembinaan mental spiritual, pola asuh anak & remaja (PAAR), kesadaran hukum, dan semangat gotong royong warga.', warna_heksadesimal: '#2563EB', warna_teks: '#ffffff' },
    { id: 2, nama: 'Pokja II', singkatan: 'Pendidikan & Keterampilan', deskripsi: 'Peningkatan pendidikan keluarga, literasi digital, pemberdayaan ekonomi perempuan melalui UP2K (Usaha Peningkatan Pendapatan Keluarga).', warna_heksadesimal: '#DB2777', warna_teks: '#ffffff' },
    { id: 3, nama: 'Pokja III', singkatan: 'Penguatan Ketahanan Pangan', deskripsi: 'Pemanfaatan pekarangan (AKU HATINYA PKK), pangan Beragam, Bergizi, Seimbang dan Aman (B2SA), serta tata laksana rumah tangga.', warna_heksadesimal: '#0284C7', warna_teks: '#ffffff' },
    { id: 4, nama: 'Pokja IV', singkatan: 'Kesehatan & Lingkungan', deskripsi: 'Pelayanan Posyandu, pencegahan stunting, kelestarian lingkungan hidup, serta perencanaan keluarga sehat berkualitas.', warna_heksadesimal: '#E11D48', warna_teks: '#ffffff' }
  ],
  pengguna: [
    { id: 1, nama: 'Admin Kelurahan Kapasmadya Baru', email: 'admin@kadaya.local', password_hash: '$2a$10$RFCFuoRNIsqKw7lRLP6p..2sNbKEjwTYbMD640hmlEaTdTA9ORWXG', peran: 'admin', pokja_id: null, wajib_ganti_sandi: false, aktif: true },
    { id: 2, nama: 'Mbak Hilwa Nabila (PIC Pokja I)', email: 'pokja1@kadaya.local', password_hash: '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', peran: 'pengurus_pokja', pokja_id: 1, wajib_ganti_sandi: false, aktif: true },
    { id: 3, nama: 'Ibu Tri Astuti (PIC Pokja II)', email: 'pokja2@kadaya.local', password_hash: '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', peran: 'pengurus_pokja', pokja_id: 2, wajib_ganti_sandi: false, aktif: true },
    { id: 4, nama: 'Ibu Nurul Aini (PIC Pokja III)', email: 'pokja3@kadaya.local', password_hash: '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', peran: 'pengurus_pokja', pokja_id: 3, wajib_ganti_sandi: false, aktif: true },
    { id: 5, nama: 'Bidan Dewi Lestari (PIC Pokja IV)', email: 'pokja4@kadaya.local', password_hash: '$2a$10$NgBCpZsvo3tGaIbM8zxoK.5Z5RqJnz6/hdH7ijrkqb006tu4z7t8m', peran: 'pengurus_pokja', pokja_id: 4, wajib_ganti_sandi: false, aktif: true }
  ],
  profil_pengurus: [
    { id: 1, nama: 'Ny. Hj. Endang Rahayu, S.Pd', jabatan: 'Ketua Tim Penggerak PKK', pokja_id: null, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', urutan: 1, aktif: true },
    { id: 2, nama: 'Ny. Hj. Masitah, M.M', jabatan: 'Wakil Ketua TP PKK', pokja_id: null, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', urutan: 2, aktif: true },
    { id: 3, nama: 'Hilwa Nabila, S.Kom', jabatan: 'Sekretaris PKK', pokja_id: null, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80', urutan: 3, aktif: true },
    { id: 4, nama: 'Siti Khotimah, S.E', jabatan: 'Bendahara PKK', pokja_id: null, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', urutan: 4, aktif: true },
    { id: 5, Dra_Hj_Sri_Wahyuni: true, nama: 'Dra. Hj. Sri Wahyuni', jabatan: 'Ketua Pokja I', pokja_id: 1, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', urutan: 5, aktif: true },
    { id: 6, nama: 'Tri Astuti, S.Pd', jabatan: 'Ketua Pokja II', pokja_id: 2, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80', urutan: 6, aktif: true },
    { id: 7, nama: 'Nurul Aini', jabatan: 'Ketua Pokja III', pokja_id: 3, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', urutan: 7, aktif: true },
    { id: 8, nama: 'Bidan Dewi Lestari, Amd.Keb', jabatan: 'Ketua Pokja IV', pokja_id: 4, periode: '2024 - 2029', foto_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', urutan: 8, aktif: true }
  ],
  kegiatan: [
    {
      id: 1,
      judul: 'Pelatihan Pola Asuh Anak & Remaja di Era Digital (PAAR Cinta)',
      tanggal: '2026-11-15',
      pokja_id: 1,
      pengguna_id: 2,
      ringkasan: 'Pembinaan ibu-ibu PKK terkait pendampingan penggunaan gawai cerdas pada anak serta penguatan nilai keagamaan dan karakter dalam keluarga.',
      lokasi: 'Balai RW 03 Kapasmadya Baru',
      jumlah_peserta: 45,
      tautan_sosmed: 'https://instagram.com/pkk_kapasmadya',
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80',
      dibuat_pada: '2026-11-15T09:00:00Z',
      diperbarui_pada: '2026-11-15T09:00:00Z'
    },
    {
      id: 2,
      judul: 'Simulasi & Gerakan Gotong Royong Lansia Produktif',
      tanggal: '2026-11-02',
      pokja_id: 1,
      pengguna_id: 2,
      ringkasan: 'Kunjungan kasih dan pendampingan lansia berdaya sekaligus kerja bakti membersihkan lingkungan balai pertemuan RT 01.',
      lokasi: 'Balai Pertemuan RW 01',
      jumlah_peserta: 32,
      tautan_sosmed: 'https://facebook.com/pkk.kapasmadya',
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
      dibuat_pada: '2026-11-02T08:30:00Z',
      diperbarui_pada: '2026-11-02T08:30:00Z'
    },
    {
      id: 3,
      judul: 'Workshop Pembuatan Kemasan & Digital Marketing UP2K PKK',
      tanggal: '2026-11-18',
      pokja_id: 2,
      pengguna_id: 3,
      ringkasan: 'Meningkatkan nilai jual karya UMKM ibu-ibu PKK dengan pelatihan desain label kemasan higienis dan teknik foto produk smartphone.',
      lokasi: 'Ruang Rapat Kelurahan Kapasmadya Baru',
      jumlah_peserta: 28,
      tautan_sosmed: 'https://instagram.com/pkk_kapasmadya',
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      dibuat_pada: '2026-11-18T10:00:00Z',
      diperbarui_pada: '2026-11-18T10:00:00Z'
    },
    {
      id: 4,
      judul: 'Pelatihan Kerajinan Tas Rajut Daur Ulang & Ecoprint Daun Lokal',
      tanggal: '2026-10-24',
      pokja_id: 2,
      pengguna_id: 3,
      ringkasan: 'Pemberdayaan keterampilan perempuan dalam mengolah kain blacu dengan teknik ecoprint daun jati serta anyaman ramah lingkungan.',
      lokasi: 'Rumah Kreatif Pokja II (RW 04)',
      jumlah_peserta: 25,
      tautan_sosmed: null,
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
      dibuat_pada: '2026-10-24T13:00:00Z',
      diperbarui_pada: '2026-10-24T13:00:00Z'
    },
    {
      id: 5,
      judul: 'Pemanfaatan Lahan Pekarangan',
      tanggal: '2026-05-25',
      pokja_id: 3,
      pengguna_id: 4,
      ringkasan: 'Kegiatan bersama Ketua TP PKK Kelurahan Kapasmadya Baru dalam mengoptimalkan lahan pekarangan melalui penanaman tanaman pangan, Tanaman Obat Keluarga (TOGA), dan tanaman hias untuk mendukung ketahanan pangan serta menciptakan lingkungan yang asri dan produktif.',
      lokasi: 'Kelurahan Kapasmadya Baru',
      jumlah_peserta: null,
      tautan_sosmed: 'https://www.instagram.com/p/DYySG3NDyXb/',
      status: 'terbit',
      foto_sampul: '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg',
      dibuat_pada: '2026-05-25T09:00:00Z',
      diperbarui_pada: '2026-05-25T09:00:00Z'
    },
    {
      id: 6,
      judul: 'Lomba Menu Kudapan B2SA Pencegah Anemia bagi Remaja Putri',
      tanggal: '2026-10-14',
      pokja_id: 3,
      pengguna_id: 4,
      ringkasan: 'Lomba olahan makanan berbasis kelor dan singkong lokal antar perwakilan RT se-Kelurahan Kapasmadya Baru.',
      lokasi: 'Pendopo Kelurahan',
      jumlah_peserta: 35,
      tautan_sosmed: null,
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
      dibuat_pada: '2026-10-14T09:30:00Z',
      diperbarui_pada: '2026-10-14T09:30:00Z'
    },
    {
      id: 7,
      judul: 'Posyandu Terintegrasi ILP Balita & Lansia Cegah Stunting',
      tanggal: '2026-11-20',
      pokja_id: 4,
      pengguna_id: 5,
      ringkasan: 'Pemeriksaan tensi, gula darah, berat-tinggi badan, pemberian vitamin A, PMT berbahan telur & susu untuk balita.',
      lokasi: 'Poskeskel Kapasmadya Baru',
      jumlah_peserta: 65,
      tautan_sosmed: 'https://instagram.com/pkk_kapasmadya',
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
      dibuat_pada: '2026-11-20T08:00:00Z',
      diperbarui_pada: '2026-11-20T08:00:00Z'
    },
    {
      id: 8,
      judul: 'Gerakan PSN (Pemberantasan Sarang Nyamuk) Serentak Bebas DBD',
      tanggal: '2026-11-08',
      pokja_id: 4,
      pengguna_id: 5,
      ringkasan: 'Pemeriksaan jentik berkala oleh kader Jumantik ibu-ibu PKK dari rumah ke rumah warga RW 01 sampai RW 05.',
      lokasi: 'Wilayah RW 01 - RW 05',
      jumlah_peserta: 50,
      tautan_sosmed: null,
      status: 'terbit',
      foto_sampul: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
      dibuat_pada: '2026-11-08T06:30:00Z',
      diperbarui_pada: '2026-11-08T06:30:00Z'
    }
  ],
  kegiatan_foto: [
    { id: 1, kegiatan_id: 1, url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80', keterangan: 'Suasana pemaparan materi parenting digital', adalah_sampul: true, urutan: 1 },
    { id: 2, kegiatan_id: 1, url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', keterangan: 'Sesi tanya jawab interaktif ibu-ibu warga', adalah_sampul: false, urutan: 2 },
    { id: 3, kegiatan_id: 3, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', keterangan: 'Praktik desain kemasan produk UMKM UP2K', adalah_sampul: true, urutan: 1 },
    { id: 4, kegiatan_id: 5, url: '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg', keterangan: 'Dokumentasi kegiatan Pemanfaatan Lahan Pekarangan, 25 Mei 2026', adalah_sampul: true, urutan: 1 },
    { id: 5, kegiatan_id: 7, url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80', keterangan: 'Penimbangan balita oleh kader posyandu terlatih', adalah_sampul: true, urutan: 1 }
  ],
  produk: [
    {
      id: 1,
      nama: 'Keripik Tempe Sagu Renyah Mba Siti',
      pokja_id: 2,
      pengguna_id: 3,
      deskripsi: 'Keripik tempe sagu olahan rumahan khas Surabaya dengan rasa gurih renyah tanpa pengawet buatan. Cocok untuk cemilan keluarga dan oleh-oleh.',
      harga: 15000,
      satuan: 'bungkus 250gr',
      foto_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80',
      nama_pemilik: 'Ibu Siti Aminah (Kader UP2K)',
      no_telepon: '081234567891',
      alamat_pemilik: 'RT 02 / RW 03, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-01T10:00:00Z'
    },
    {
      id: 2,
      nama: 'Scarf Sutra Ecoprint Daun Jati & Jenitri',
      pokja_id: 2,
      pengguna_id: 3,
      deskripsi: 'Kain scarf sutra motif ecoprint murni menggunakan dedaunan alami lokal Kapasmadya Baru. Pewarna alami kayu secang, sejuk dan elegan.',
      harga: 120000,
      satuan: 'helai',
      foto_url: '/images/scarf-sutra-ecoprint-daun-jati-jenitri.jpg',
      nama_pemilik: 'Ibu Tri Astuti (Pokja II)',
      no_telepon: '081398765432',
      alamat_pemilik: 'RT 04 / RW 04, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-03T11:00:00Z'
    },
    {
      id: 3,
      nama: 'Sambal Bajak Roa Uleg Tradisional',
      pokja_id: 3,
      pengguna_id: 4,
      deskripsi: 'Sambal rumahan khas Suroboyo dengan cabai segar dan terasi bakar pilihan. Dikemas dalam toples segel higienis, tahan 1 bulan.',
      harga: 25000,
      satuan: 'toples 180gr',
      foto_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
      nama_pemilik: 'Ibu Sri Mulyani',
      no_telepon: '085712348901',
      alamat_pemilik: 'RT 05 / RW 01, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-05T09:30:00Z'
    },
    {
      id: 4,
      nama: 'Sirup Bunga Telang Segar "Kebun Gizi"',
      pokja_id: 3,
      pengguna_id: 4,
      deskripsi: 'Minuman herbal kaya antioksidan dari bunga telang segar hasil kebun hidroponik PKK Pokja III, dipadu serai dan gula tebu asli.',
      harga: 18000,
      satuan: 'botol 250ml',
      foto_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80',
      nama_pemilik: 'Ibu Nurul Aini (Pokja III)',
      no_telepon: '081287654321',
      alamat_pemilik: 'RT 01 / RW 02, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-07T14:00:00Z'
    },
    {
      id: 5,
      nama: 'Tas Anyaman Daur Ulang Modis (Jali Premium)',
      pokja_id: 2,
      pengguna_id: 3,
      deskripsi: 'Tas belanja dan bepergian modis berbahan anyaman jali daur ulang yang kuat, anti air, dan mudah dibersihkan. Membantu kurangi sampah plastik.',
      harga: 45000,
      satuan: 'buah',
      foto_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      nama_pemilik: 'Ibu Ratna Dewi',
      no_telepon: '087812345678',
      alamat_pemilik: 'RT 03 / RW 02, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-09T16:00:00Z'
    },
    {
      id: 6,
      nama: 'Jamu Beras Kencur & Kunyit Asam Segar',
      pokja_id: 4,
      pengguna_id: 5,
      deskripsi: 'Minuman tradisional warisan leluhur dibuat dari rimpang pilihan berkhasiat menjaga kebugaran tubuh dan imunitas keluarga.',
      harga: 12000,
      satuan: 'botol 350ml',
      foto_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80',
      nama_pemilik: 'Ibu Warsini (Kader Posyandu)',
      no_telepon: '081345678910',
      alamat_pemilik: 'RT 03 / RW 05, Kapasmadya Baru',
      tersedia: true,
      dibuat_pada: '2026-11-12T07:30:00Z'
    }
  ],
  jadwal: [
    {
      id: 1,
      judul: 'Posyandu ILP Balita & Lansia Rutin RW 02',
      tanggal: '2026-11-25',
      waktu_mulai: '08:00',
      waktu_selesai: '11:30',
      lokasi: 'Balai RW 02 Kapasmadya Baru',
      pokja_id: 4,
      kegiatan_id: null,
      keterangan: 'Penimbangan berat badan, imunisasi, dan konseling gizi pencegahan stunting.',
      status: 'akan_datang'
    },
    {
      id: 2,
      judul: 'Rapat Koordinasi Pleno Bulanan Pengurus PKK',
      tanggal: '2026-11-28',
      waktu_mulai: '15:30',
      waktu_selesai: '17:30',
      lokasi: 'Pendopo Kelurahan Lt. 2',
      pokja_id: null,
      kegiatan_id: null,
      keterangan: 'Evaluasi program kerja Pokja I-IV dan persiapan gebyar akhir tahun.',
      status: 'akan_datang'
    },
    {
      id: 3,
      judul: 'Bazar Produk Olahan Pangan Lokal & Kerajinan UP2K',
      tanggal: '2026-12-05',
      waktu_mulai: '07:00',
      waktu_selesai: '12:00',
      lokasi: 'Halaman Kantor Kelurahan',
      pokja_id: 2,
      kegiatan_id: null,
      keterangan: 'Pameran karya ibu-ibu PKK sekaligus etalase produk binaan KADAYA.',
      status: 'akan_datang'
    },
    {
      id: 4,
      judul: 'Pemeriksaan Jentik & Kerja Bakti Kebersihan Lingkungan',
      tanggal: '2026-12-10',
      waktu_mulai: '06:30',
      waktu_selesai: '09:00',
      lokasi: 'Lingkungan RW 01 - 05',
      pokja_id: 4,
      kegiatan_id: null,
      keterangan: 'Gerakan PSN serentak bersama warga dan kader Jumantik PKK.',
      status: 'akan_datang'
    },
    {
      id: 5,
      judul: 'Aksi Panen Raya Sayur Hidroponik "AKU HATINYA PKK"',
      tanggal: '2026-11-10',
      waktu_mulai: '08:00',
      waktu_selesai: '10:00',
      lokasi: 'Kebun Gizi RW 02',
      pokja_id: 3,
      kegiatan_id: 5,
      keterangan: 'Sudah terlaksana dengan sukses.',
      status: 'selesai'
    }
  ],
  pengumuman: [
    {
      id: 1,
      judul: 'Jadwal Pemberian Vitamin A & Vaksinasi Balita Bulan November',
      isi: 'Diberitahukan kepada seluruh ibu balita Kelurahan Kapasmadya Baru agar membawa buku KIA pada jadwal Posyandu terdekat untuk mendapatkan kapsul Vitamin A biru/merah secara gratis.',
      penting: true,
      tayang_mulai: '2026-11-01',
      tayang_sampai: '2026-11-30'
    },
    {
      id: 2,
      judul: 'Pendaftaran Terbuka Pelatihan Keterampilan Menjahit & Bordir',
      isi: 'Pokja II PKK membuka kelas pelatihan keterampilan perempuan untuk 20 orang pendaftar warga Kapasmadya Baru. Gratis tanpa dipungut biaya. Hubungi Sekretariat PKK kelurahan.',
      penting: false,
      tayang_mulai: '2026-11-15',
      tayang_sampai: '2026-12-05'
    },
    {
      id: 3,
      judul: 'Etalase Karya KADAYA: Dukung Usaha Ibu-Ibu PKK Kita',
      isi: 'Kini warga dapat melihat produk olahan makanan dan kerajinan tangan karya ibu-ibu PKK langsung di website KADAYA. Hubungi nomor WhatsApp pengrajin untuk pemesanan!',
      penting: true,
      tayang_mulai: '2026-11-01',
      tayang_sampai: '2026-12-31'
    }
  ],
  pesan_kontak: [
    {
      id: 1,
      nama_pengirim: 'Rina Agustina',
      kontak_pengirim: '081299887766',
      jenis: 'pesanan_produk',
      produk_id: 1,
      pesan: 'Halo, saya ingin memesan Keripik Tempe Sagu Ibu Siti sebanyak 10 bungkus untuk acara keluarga hari Minggu depan. Apakah bisa diambil langsung ke rumah beliau?',
      status: 'dibaca',
      catatan_admin: 'Diteruskan ke Bu Siti via WhatsApp',
      dibuat_pada: '2026-11-20T10:15:00Z'
    },
    {
      id: 2,
      nama_pengirim: 'Fajar Ramadhan',
      kontak_pengirim: 'fajar.ramadhan@mhs.unesa.ac.id',
      jenis: 'relawan',
      produk_id: null,
      pesan: 'Selamat siang ibu pengurus PKK, saya mahasiswa yang ingin menjadi relawan mengajar literasi digital untuk anak-anak di Pojok Bacaan RW 03. Bagaimana mekanismenya?',
      status: 'baru',
      catatan_admin: null,
      dibuat_pada: '2026-11-21T14:40:00Z'
    },
    {
      id: 3,
      nama_pengirim: 'Dewi Sartika',
      kontak_pengirim: '085744332211',
      jenis: 'pertanyaan',
      produk_id: null,
      pesan: 'Mohon info persyaratan untuk bergabung dalam kelompok UP2K binaan Pokja II apakah harus sudah memiliki produk sendiri?',
      status: 'dibalas',
      catatan_admin: 'Dijawab via chat WA',
      dibuat_pada: '2026-11-22T09:12:00Z'
    }
  ],
  log_aktivitas: [
    { id: 1, pengguna_id: 1, nama_pengguna: 'Admin', aksi: 'SEEDED', entitas: 'sistem', entitas_id: 0, rincian: 'Inisialisasi data master dan dummy PKK Kelurahan Kapasmadya Baru', dibuat_pada: '2026-11-22T10:00:00Z' },
    { id: 2, pengguna_id: 2, nama_pengguna: 'Mbak Hilwa Nabila (Pokja I)', aksi: 'CREATE', entitas: 'kegiatan', entitas_id: 1, rincian: 'Unggah dokumentasi: Pelatihan Pola Asuh Anak & Remaja di Era Digital', dibuat_pada: '2026-11-22T10:15:00Z' },
    { id: 3, pengguna_id: 3, nama_pengguna: 'Ibu Tri Astuti (Pokja II)', aksi: 'CREATE', entitas: 'produk', entitas_id: 1, rincian: 'Menambahkan produk UMKM: Keripik Tempe Sagu Renyah Mba Siti', dibuat_pada: '2026-11-22T11:00:00Z' },
    { id: 4, pengguna_id: 4, nama_pengguna: 'Ibu Nurul Aini (Pokja III)', aksi: 'CREATE', entitas: 'kegiatan', entitas_id: 5, rincian: 'Unggah dokumentasi: Panen Raya Sayur Hidroponik AKU HATINYA PKK', dibuat_pada: '2026-11-22T11:30:00Z' },
    { id: 5, pengguna_id: 5, nama_pengguna: 'Bidan Dewi Lestari (Pokja IV)', aksi: 'CREATE', entitas: 'kegiatan', entitas_id: 7, rincian: 'Unggah dokumentasi: Posyandu Terintegrasi ILP Balita & Lansia', dibuat_pada: '2026-11-22T12:00:00Z' }
  ]
};

// State memori aktif
const store = JSON.parse(JSON.stringify(defaultData));

let counters = {
  kegiatan: 10,
  kegiatan_foto: 10,
  produk: 10,
  jadwal: 10,
  pengumuman: 10,
  pesan_kontak: 10,
  log_aktivitas: 10,
  pengguna: 10,
  profil_pengurus: 10
};

// Logging aktivitas otomatis
function tambahLog(pengguna_id, nama_pengguna, aksi, entitas, entitas_id, rincian) {
  counters.log_aktivitas += 1;
  const logItem = {
    id: counters.log_aktivitas,
    pengguna_id,
    nama_pengguna: nama_pengguna || 'Pengguna',
    aksi,
    entitas,
    entitas_id,
    rincian,
    dibuat_pada: new Date().toISOString()
  };
  store.log_aktivitas.unshift(logItem);
  return logItem;
}

const dbService = {
  initDb,
  isPostgres: () => usePostgres,
  store,
  counters,
  tambahLog,

  // Helper untuk Pokja
  async getPokjaList() {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM pokja ORDER BY id ASC');
      return res.rows;
    }
    return store.pokja;
  },

  // Helper Pengguna
  async cariPenggunaByEmail(email) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM pengguna WHERE email = $1', [email]);
      return res.rows[0] || null;
    }
    return store.pengguna.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async cariPenggunaById(id) {
    if (usePostgres) {
      const res = await pool.query('SELECT id, nama, email, peran, pokja_id, wajib_ganti_sandi, aktif FROM pengguna WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const p = store.pengguna.find(u => u.id === Number(id));
    if (!p) return null;
    const { password_hash, ...rest } = p;
    return rest;
  },

  async buatPengguna(data) {
    if (usePostgres) {
      const res = await pool.query(
        'INSERT INTO pengguna (nama, email, password_hash, peran, pokja_id, wajib_ganti_sandi, aktif) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nama, email, peran, pokja_id, wajib_ganti_sandi, aktif',
        [data.nama, data.email, data.password_hash, data.peran, data.pokja_id, data.wajib_ganti_sandi ?? true, true]
      );
      return res.rows[0];
    }
    counters.pengguna += 1;
    const item = {
      id: counters.pengguna,
      nama: data.nama,
      email: data.email,
      password_hash: data.password_hash,
      peran: data.peran,
      pokja_id: data.pokja_id ? Number(data.pokja_id) : null,
      wajib_ganti_sandi: data.wajib_ganti_sandi ?? true,
      aktif: true,
      dibuat_pada: new Date().toISOString()
    };
    store.pengguna.push(item);
    const { password_hash, ...rest } = item;
    return rest;
  },

  async ubahSandiPengguna(id, newHash, wajibGanti = false) {
    if (usePostgres) {
      await pool.query('UPDATE pengguna SET password_hash = $1, wajib_ganti_sandi = $2 WHERE id = $3', [newHash, wajibGanti, id]);
      return true;
    }
    const u = store.pengguna.find(x => x.id === Number(id));
    if (u) {
      u.password_hash = newHash;
      u.wajib_ganti_sandi = wajibGanti;
      return true;
    }
    return false;
  },

  // Profil Pengurus
  async getProfilPengurus() {
    if (usePostgres) {
      const res = await pool.query('SELECT pp.*, p.nama as pokja_nama, p.warna_heksadesimal as pokja_warna FROM profil_pengurus pp LEFT JOIN pokja p ON pp.pokja_id = p.id WHERE pp.aktif = true ORDER BY pp.urutan ASC');
      return res.rows;
    }
    return store.profil_pengurus.map(pp => {
      const pok = store.pokja.find(x => x.id === pp.pokja_id);
      return {
        ...pp,
        pokja_nama: pok ? pok.nama : 'Pengurus Inti',
        pokja_warna: pok ? pok.warna_heksadesimal : '#2563EB'
      };
    }).sort((a, b) => a.urutan - b.urutan);
  },

  // Kegiatan Publik & Filter (Mendukung q, pokja, tanggal kalender)
  async getKegiatanPublik({ q, pokja, tanggal, halaman = 1, batas = 12 }) {
    if (usePostgres) {
      let conditions = ["k.status = 'terbit'"];
      let params = [];
      let idx = 1;

      if (q) {
        conditions.push(`(k.judul ILIKE $${idx} OR k.ringkasan ILIKE $${idx} OR k.lokasi ILIKE $${idx})`);
        params.push(`%${q}%`);
        idx++;
      }
      if (pokja) {
        conditions.push(`k.pokja_id = $${idx}`);
        params.push(Number(pokja));
        idx++;
      }
      if (tanggal) {
        conditions.push(`k.tanggal = $${idx}`);
        params.push(tanggal);
        idx++;
      }

      const whereClause = conditions.join(' AND ');
      const countRes = await pool.query(`SELECT COUNT(*) FROM kegiatan k WHERE ${whereClause}`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const offset = (halaman - 1) * batas;
      const dataQuery = `
        SELECT k.*, p.nama AS pokja_nama, p.singkatan AS pokja_singkatan, p.warna_heksadesimal AS pokja_warna
        FROM kegiatan k
        JOIN pokja p ON k.pokja_id = p.id
        WHERE ${whereClause}
        ORDER BY k.tanggal DESC
        LIMIT $${idx} OFFSET $${idx + 1}
      `;
      const dataRes = await pool.query(dataQuery, [...params, batas, offset]);
      return {
        data: dataRes.rows,
        meta: { halaman: Number(halaman), per_halaman: batas, total, total_halaman: Math.ceil(total / batas) }
      };
    }

    // In-memory filter
    let list = store.kegiatan.filter(k => k.status === 'terbit');

    if (q) {
      const search = q.toLowerCase();
      list = list.filter(k =>
        k.judul.toLowerCase().includes(search) ||
        (k.ringkasan && k.ringkasan.toLowerCase().includes(search)) ||
        (k.lokasi && k.lokasi.toLowerCase().includes(search))
      );
    }
    if (pokja) {
      list = list.filter(k => k.pokja_id === Number(pokja));
    }
    if (tanggal) {
      list = list.filter(k => k.tanggal === tanggal);
    }

    list.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    const total = list.length;
    const offset = (halaman - 1) * batas;
    const paged = list.slice(offset, offset + batas).map(k => {
      const pok = store.pokja.find(p => p.id === k.pokja_id);
      return {
        ...k,
        pokja_nama: pok ? pok.nama : '',
        pokja_singkatan: pok ? pok.singkatan : '',
        pokja_warna: pok ? pok.warna_heksadesimal : '#2563EB'
      };
    });

    return {
      data: paged,
      meta: { halaman: Number(halaman), per_halaman: batas, total, total_halaman: Math.ceil(total / batas) }
    };
  },

  async getKegiatanDetail(id) {
    if (usePostgres) {
      const res = await pool.query(
        `SELECT k.*, p.nama AS pokja_nama, p.singkatan AS pokja_singkatan, p.warna_heksadesimal AS pokja_warna
         FROM kegiatan k
         JOIN pokja p ON k.pokja_id = p.id
         WHERE k.id = $1`,
        [id]
      );
      if (res.rows.length === 0) return null;
      const k = res.rows[0];
      const fotoRes = await pool.query('SELECT * FROM kegiatan_foto WHERE kegiatan_id = $1 ORDER BY urutan ASC', [id]);
      return { ...k, galeri: fotoRes.rows };
    }

    const k = store.kegiatan.find(item => item.id === Number(id));
    if (!k) return null;
    const pok = store.pokja.find(p => p.id === k.pokja_id);
    const galeri = store.kegiatan_foto.filter(f => f.kegiatan_id === Number(id));
    return {
      ...k,
      pokja_nama: pok ? pok.nama : '',
      pokja_singkatan: pok ? pok.singkatan : '',
      pokja_warna: pok ? pok.warna_heksadesimal : '#2563EB',
      galeri
    };
  },

  // Produk UMKM (Mendukung informasi Pemilik dan Nomor Telepon WhatsApp)
  async getProdukList({ pokja, search } = {}) {
    if (usePostgres) {
      let conditions = ['pr.tersedia = true'];
      let params = [];
      let idx = 1;

      if (pokja) {
        conditions.push(`pr.pokja_id = $${idx}`);
        params.push(Number(pokja));
        idx++;
      }
      if (search) {
        conditions.push(`(pr.nama ILIKE $${idx} OR pr.deskripsi ILIKE $${idx} OR pr.nama_pemilik ILIKE $${idx})`);
        params.push(`%${search}%`);
        idx++;
      }

      const query = `
        SELECT pr.*, p.nama AS pokja_nama, p.warna_heksadesimal AS pokja_warna
        FROM produk pr
        JOIN pokja p ON pr.pokja_id = p.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY pr.id DESC
      `;
      const res = await pool.query(query, params);
      return res.rows;
    }

    let list = store.produk.filter(pr => pr.tersedia === true);
    if (pokja) {
      list = list.filter(pr => pr.pokja_id === Number(pokja));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(pr =>
        pr.nama.toLowerCase().includes(s) ||
        (pr.deskripsi && pr.deskripsi.toLowerCase().includes(s)) ||
        (pr.nama_pemilik && pr.nama_pemilik.toLowerCase().includes(s))
      );
    }
    return list.map(pr => {
      const pok = store.pokja.find(p => p.id === pr.pokja_id);
      return {
        ...pr,
        pokja_nama: pok ? pok.nama : '',
        pokja_warna: pok ? pok.warna_heksadesimal : '#2563EB'
      };
    });
  },

  // Jadwal
  async getJadwalList({ status } = {}) {
    if (usePostgres) {
      let query = `
        SELECT j.*, p.nama AS pokja_nama, p.warna_heksadesimal AS pokja_warna
        FROM jadwal j
        LEFT JOIN pokja p ON j.pokja_id = p.id
      `;
      let params = [];
      if (status) {
        query += ' WHERE j.status = $1';
        params.push(status);
      }
      query += ' ORDER BY j.tanggal ASC, j.waktu_mulai ASC';
      const res = await pool.query(query, params);
      return res.rows;
    }

    let list = [...store.jadwal];
    if (status) {
      list = list.filter(j => j.status === status);
    }
    list.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    return list.map(j => {
      const pok = store.pokja.find(p => p.id === j.pokja_id);
      return {
        ...j,
        pokja_nama: pok ? pok.nama : 'Semua Pokja / Pleno',
        pokja_warna: pok ? pok.warna_heksadesimal : '#2563EB'
      };
    });
  },

  // Pengumuman
  async getPengumumanAktif() {
    if (usePostgres) {
      const res = await pool.query(
        `SELECT * FROM pengumuman
         WHERE tayang_mulai <= CURRENT_DATE AND tayang_sampai >= CURRENT_DATE
         ORDER BY penting DESC, tayang_mulai DESC`
      );
      return res.rows;
    }
    const today = new Date().toISOString().split('T')[0];
    return store.pengumuman
      .filter(p => p.tayang_mulai <= today && p.tayang_sampai >= today)
      .sort((a, b) => (b.penting ? 1 : 0) - (a.penting ? 1 : 0));
  },

  // Statistik SDGs 5 (Capaian Pokja & Partisipasi Perempuan)
  async getStatistik() {
    if (usePostgres) {
      const pokjaRes = await pool.query('SELECT * FROM v_statistik_pokja ORDER BY pokja_id ASC');
      const bulananRes = await pool.query('SELECT * FROM v_statistik_bulanan');
      const totalKegiatan = await pool.query("SELECT COUNT(*) FROM kegiatan WHERE status = 'terbit'");
      const totalPeserta = await pool.query("SELECT COALESCE(SUM(jumlah_peserta), 0) FROM kegiatan WHERE status = 'terbit'");
      const totalProduk = await pool.query("SELECT COUNT(*) FROM produk WHERE tersedia = true");

      return {
        ringkasan: {
          total_kegiatan: parseInt(totalKegiatan.rows[0].count, 10),
          total_peserta: parseInt(totalPeserta.rows[0].coalesce, 10),
          total_produk: parseInt(totalProduk.rows[0].count, 10)
        },
        per_pokja: pokjaRes.rows,
        bulanan: bulananRes.rows
      };
    }

    // In-memory aggregation
    const perPokja = store.pokja.map(p => {
      const kegs = store.kegiatan.filter(k => k.pokja_id === p.id && k.status === 'terbit');
      const prods = store.produk.filter(pr => pr.pokja_id === p.id && pr.tersedia === true);
      const totalPeserta = kegs.reduce((acc, curr) => acc + (curr.jumlah_peserta || 0), 0);
      return {
        pokja_id: p.id,
        pokja_nama: p.nama,
        pokja_singkatan: p.singkatan,
        pokja_warna: p.warna_heksadesimal,
        total_kegiatan: kegs.length,
        total_peserta: totalPeserta,
        total_produk: prods.length
      };
    });

    const activeKegs = store.kegiatan.filter(k => k.status === 'terbit');
    const totalPeserta = activeKegs.reduce((acc, curr) => acc + (curr.jumlah_peserta || 0), 0);
    const totalProduk = store.produk.filter(pr => pr.tersedia === true).length;

    // Bulan grouping
    const bulananMap = {};
    activeKegs.forEach(k => {
      const key = k.tanggal.substring(0, 7); // YYYY-MM
      if (!bulananMap[key]) {
        bulananMap[key] = { bulan_tahun: key, jumlah_kegiatan: 0, total_peserta: 0 };
      }
      bulananMap[key].jumlah_kegiatan += 1;
      bulananMap[key].total_peserta += (k.jumlah_peserta || 0);
    });

    const bulanan = Object.values(bulananMap).sort((a, b) => b.bulan_tahun.localeCompare(a.bulan_tahun));

    return {
      ringkasan: {
        total_kegiatan: activeKegs.length,
        total_peserta: totalPeserta,
        total_produk: totalProduk
      },
      per_pokja: perPokja,
      bulanan
    };
  }
};

module.exports = dbService;
