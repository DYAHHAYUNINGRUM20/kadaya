-- Perbarui foto produk Scarf Sutra Ecoprint Daun Jati & Jenitri (ID 2)
-- Jalankan satu kali pada database PostgreSQL KADAYA yang sudah ada.
UPDATE produk
SET foto_url = '/images/scarf-sutra-ecoprint-daun-jati-jenitri.jpg',
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 2
  AND nama = 'Scarf Sutra Ecoprint Daun Jati & Jenitri';
