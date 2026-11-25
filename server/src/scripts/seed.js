const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  console.log('Menjalankan migrasi skema dan seed data PostgreSQL...');
  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const seedPath = path.join(__dirname, '../../../database/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Mengeksekusi database/schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Skema berhasil dibuat.');

    console.log('Mengeksekusi database/seed.sql...');
    await pool.query(seedSql);
    console.log('✅ Data awal (seed) berhasil dimuat.');

    console.log('🎉 Migrasi PostgreSQL selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menjalankan seed:', err);
    process.exit(1);
  }
}

runSeed();
