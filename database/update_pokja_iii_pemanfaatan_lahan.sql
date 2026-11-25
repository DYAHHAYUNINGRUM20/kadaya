-- Jalankan sekali pada database KADAYA yang sudah ada.
-- Mengubah hanya kegiatan ID 5 dan foto galerinya.
BEGIN;
UPDATE kegiatan
SET judul = 'Pemanfaatan Lahan Pekarangan',
    tanggal = '2026-05-25',
    pokja_id = 3,
    pengguna_id = 4,
    ringkasan = 'Kegiatan bersama Ketua TP PKK Kelurahan Kapasmadya Baru dalam mengoptimalkan lahan pekarangan melalui penanaman tanaman pangan, Tanaman Obat Keluarga (TOGA), dan tanaman hias untuk mendukung ketahanan pangan serta menciptakan lingkungan yang asri dan produktif.',
    lokasi = 'Kelurahan Kapasmadya Baru',
    jumlah_peserta = NULL,
    tautan_sosmed = 'https://www.instagram.com/p/DYySG3NDyXb/',
    foto_sampul = '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg',
    diperbarui_pada = NOW()
WHERE id = 5;
DELETE FROM kegiatan_foto WHERE kegiatan_id = 5;
INSERT INTO kegiatan_foto (id, kegiatan_id, url, keterangan, adalah_sampul, urutan)
VALUES (4, 5, '/images/pokja-iii-pemanfaatan-lahan-pekarangan.jpg', 'Dokumentasi kegiatan Pemanfaatan Lahan Pekarangan, 25 Mei 2026', true, 1)
ON CONFLICT (id) DO UPDATE SET kegiatan_id = EXCLUDED.kegiatan_id, url = EXCLUDED.url, keterangan = EXCLUDED.keterangan, adalah_sampul = EXCLUDED.adalah_sampul, urutan = EXCLUDED.urutan;
COMMIT;
