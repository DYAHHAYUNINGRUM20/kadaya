# KADAYA (Kapasmadya Berdaya)

Platform web resmi untuk **Tim Penggerak PKK Kelurahan Kapasmadya Baru, Kecamatan Tambaksari, Kota Surabaya**.

KADAYA menjadi wadah digital terpusat untuk mendokumentasikan kegiatan Pokja I sampai IV secara seragam, memamerkan hasil karya dan produk UMKM binaan anggota PKK (UP2K), mengumumkan jadwal agenda posyandu/pertemuan warga, serta memperkuat keterbukaan informasi publik desa/kelurahan. Proyek ini dibangun guna mendukung **Tujuan Pembangunan Berkelanjutan (SDGs) Nomor 5: Kesetaraan Gender (Gender Equality)**.

---

## 1. Tech Stack
- **Frontend:** React (Vite) · React Router v6 · Tailwind CSS · Lucide Icons
- **Backend:** Node.js (Express) · JWT (JSON Web Token) · bcryptjs · CORS
- **Database:** PostgreSQL (driver `pg`, SQL murni dengan skema dan seed data lengkap) + Smart Data Store Fallback untuk kemudahan pengujian/evaluasi.

---

## 2. Dukungan Nyata terhadap SDGs 5 (Kesetaraan Gender)

KADAYA secara khusus dirancang untuk memberdayakan perempuan di tingkat kelurahan/desa:

| Target SDGs 5 | Implementasi Nyata di Website KADAYA |
|---|---|
| **Target 5.5: Kepemimpinan & Partisipasi Perempuan** | Profil lengkap pengurus TP PKK dan ketua Pokja I–IV ditampilkan; halaman statistik memperlihatkan data kuantitatif partisipasi perempuan di posyandu, pelatihan, dan forum warga. |
| **Target 5.a: Hak atas Sumber Daya Ekonomi** | Etalase karya UMKM binaan PKK (UP2K) menampilkan **nama ibu pemilik/pengrajin**, **nomor telepon/WhatsApp**, domisili RT/RW, dan tombol pemesanan langsung via WhatsApp. Jual beli dilakukan secara mandiri di luar platform guna menjaga kemandirian ekonomi keluarga. |
| **Target 5.b: Pemanfaatan Teknologi & Inklusi Digital** | Antarmuka ramah literasi digital: ukuran teks minimal 18px, target sentuh minimal 48px, panduan 3 langkah bergambar di dashboard, dan formulir pengunggahan dokumentasi yang hanya mewajibkan 3 kolom utama. |

---

## 3. Fitur Utama Berdasarkan Peran

### A. Pengguna Publik (Warga, Generasi Muda, Calon Pembeli)
1. **Beranda:** Pencarian cepat, pintasan Pokja I–IV, dokumentasi terbaru, agenda terdekat, dan banner edukasi SDGs 5.
2. **Profil PKK:** Visi, misi, 10 Program Pokok PKK, dan struktur organisasi jajaran pengurus.
3. **Arsip Kegiatan Pokja:** Filter pencarian kata kunci, filter Pokja, dan **Filter Kalender Tanggal** bawaan browser (format `dd/mm/yyyy`, tombol Hapus dan Hari ini).
4. **Detail Dokumentasi:** Uraian lengkap, statistik peserta, lokasi, galeri foto, tombol **Bagikan ke WhatsApp**, dan salin tautan.
5. **Etalase Produk UMKM (Non-Transaksi):**
   - Menampilkan foto, nama produk, kategori Pokja, dan harga.
   - **Menampilkan Nama Pemilik/Pengrajin** dan **Nomor Telepon/WhatsApp Pemilik**.
   - Tombol **"Pesan via WhatsApp"** yang langsung membuka obrolan WA ke nomor ibu pengrajin dengan pesan otomatis ramah.
   - Penjelasan bahwa jual beli dilakukan langsung di luar platform untuk mendukung usaha mandiri ibu-ibu PKK.
6. **Jadwal & Agenda:** Daftar agenda akan datang dan riwayat kegiatan yang tertaut ke arsip dokumentasi.
7. **Papan Pengumuman:** Informasi imunisasi, bansos, dan pelatihan gratis warga.
8. **Statistik Capaian:** Visualisasi data per Pokja, kegiatan bulanan, dan indikator SDGs 5.
9. **Kontak Warga:** Informasi kantor sekretariat PKK dan form pesan interaktif (pilihan: pertanyaan, pesanan produk, atau relawan).

### B. Pengurus Pokja (`/dashboard`)
1. **Ringkasan:** Sapaan hangat, jumlah dokumentasi Pokja, **Panduan 3 Langkah Bergambar**, dan tombol cepat.
2. **Formulir Dokumentasi 3 Kolom Wajib:** Judul kegiatan, Tanggal (kalender), dan Pokja (terisi & terkunci otomatis). Kolom tambahan (lokasi, peserta, ringkasan, foto) bersifat opsional.
3. **Penyimpanan Draf Otomatis:** Input form tersimpan sementara di browser agar tidak hilang jika halaman tertutup tidak sengaja.
4. **Kelola Produk Pokja:** Tambah, ubah, dan hapus karya anggota lengkap dengan nama pemilik & nomor kontak WhatsApp.
5. **Kelola Jadwal Pokja:** Tambah dan atur agenda kegiatan wilayahnya.

### C. Admin Kelurahan (`/admin`)
1. **Statistik Admin:** Ringkasan pesan masuk baru, total dokumentasi, akun terdaftar, dan produk aktif.
2. **Manajemen Akun Pengguna:** Membuat akun PIC Pokja atau Admin baru dengan kata sandi sementara, mereset sandi, dan menonaktifkan akun.
3. **Moderasi Dokumentasi Seluruh Pokja:** Meninjau semua kegiatan, menyembunyikan atau menayangkan kembali ke publik.
4. **Kotak Masuk Pesan Warga:** Membaca pesan warga, menandai selesai, dan membalas langsung ke nomor WhatsApp pengirim dengan satu klik.
5. **Manajemen Pengumuman:** Mengatur masa tayang dan menandai pengumuman penting/mendesak.
6. **Jejak Audit Log Aktivitas:** Rekam jejak seluruh aksi tambah, ubah, hapus, dan login sistem.

---

## 4. Struktur Repositori

```
kadaya/
├── README.md                   # Dokumentasi lengkap proyek
├── docker-compose.yml          # Konfigurasi PostgreSQL untuk pengembangan
├── .env.example                # Contoh environment variables
├── database/
│   ├── schema.sql              # Skema DDL tabel, view, dan indeks PostgreSQL
│   └── seed.sql                # Data dummy realistis PKK Kelurahan Kapasmadya Baru
├── server/                     # Backend Express API
│   ├── package.json
│   ├── .env
│   ├── uploads/                # Penyimpanan foto lokal
│   └── src/
│       ├── index.js            # Entry point Express
│       ├── config/             # Konfigurasi database pool
│       ├── middleware/         # Middleware auth JWT & RBAC
│       ├── routes/             # Rute auth, publik, kegiatan, produk, jadwal, admin
│       ├── services/           # DB Service & Smart in-memory store
│       └── scripts/            # Script database migration & seed
└── web/                        # Frontend React + Vite
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/         # Navbar, Footer, SdgsBanner
        ├── context/            # AuthContext
        ├── services/           # api.js client
        └── pages/
            ├── publik/         # 8 Halaman publik warga
            ├── auth/           # Login pengurus
            ├── dashboard/      # Panel Pengurus Pokja
            └── admin/          # Panel Admin Kelurahan
```

---

## 5. Cara Menjalankan Proyek

### Prasyarat
- Node.js versi 18+ (disarankan Node.js 20+)
- PostgreSQL (dapat menggunakan Docker atau PostgreSQL lokal)

### Langkah 1: Pengaturan Database PostgreSQL (Opsional jika menggunakan Docker)
Jika Anda menggunakan Docker:
```bash
docker compose up -d
```
*(Skema di `database/schema.sql` dan seed data di `database/seed.sql` akan dimuat secara otomatis).*

Jika menggunakan PostgreSQL lokal yang sudah terpasang:
```bash
psql -U postgres -d kadaya -f database/schema.sql
psql -U postgres -d kadaya -f database/seed.sql
```

> **Catatan Pengujian Fleksibel:** Backend KADAYA dilengkapi dengan *Smart Data Store fallback*. Jika PostgreSQL belum dijalankan di komputer Anda, backend akan otomatis menggunakan in-memory store yang berisi data dummy identik dengan `seed.sql`, sehingga reviewer atau dosen pengampu dapat langsung menguji coba seluruh fitur tanpa kendala konfigurasi port/database!

### Langkah 2: Menjalankan Backend API
Buka terminal:
```bash
cd server
npm install
npm run dev
```
Backend akan berjalan di **`http://localhost:4000`**.

### Langkah 3: Menjalankan Frontend React
Buka terminal baru:
```bash
cd web
npm install
npm run dev
```
Frontend akan berjalan di **`http://localhost:5173`**.

---

## 6. Akun Demo untuk Pengujian

Halaman masuk `/masuk` juga dilengkapi tombol pintas (quick-fill) untuk memilih akun demo dengan 1 klik:

| Peran | Alamat Email | Kata Sandi | Keterangan |
|---|---|---|---|
| **Admin Kelurahan** | `admin@kadaya.local` | `Admin#2026` | Akses penuh ke seluruh menu admin, moderasi, akun, dan pesan warga |
| **Pengurus Pokja I** | `pokja1@kadaya.local` | `Pokja#2026` | Mengelola kegiatan & agenda Pokja I (PAAR & Gotong Royong) |
| **Pengurus Pokja II** | `pokja2@kadaya.local` | `Pokja#2026` | Mengelola kegiatan, agenda, dan produk UMKM UP2K Pokja II |
| **Pengurus Pokja III** | `pokja3@kadaya.local` | `Pokja#2026` | Mengelola kegiatan & produk Pokja III (Ketahanan Pangan & B2SA) |
| **Pengurus Pokja IV** | `pokja4@kadaya.local` | `Pokja#2026` | Mengelola kegiatan Posyandu, agenda, & produk herbal Pokja IV |

---

## 7. Lokasi Implementasi Mitra Desa/Kelurahan
- **Mitra:** Tim Penggerak PKK Kelurahan Kapasmadya Baru
- **Alamat:** Jl. Kapas Madya II No. 54, Kelurahan Kapasmadya Baru, Kecamatan Tambaksari, Kota Surabaya, Jawa Timur 60134.
- **Konteks:** Mahasiswa D4 Manajemen Informatika Semester 5 - Proyek Implementasi Studi Independen.
