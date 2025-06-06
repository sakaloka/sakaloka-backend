import fs from 'fs';
import csv from 'csv-parser';
import db from '../database.js'; 

const csvFilePath = '../eco_place.csv';

const importCategories = async () => {
  const results = [];

  // Step 1: Baca semua data dari CSV dulu
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  // Step 2: Proses per baris
  for (const row of results) {
    const placeId = parseInt(row.place_id);
    if (isNaN(placeId)) continue;

    const categories = row.category
      ? row.category.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    for (const categoryName of categories) {
      try {
        // 1. Cek apakah kategori sudah ada
        const [existing] = await db.execute(
          'SELECT id FROM categories WHERE name = ?',
          [categoryName]
        );

        let categoryId;
        if (existing.length > 0) {
          categoryId = existing[0].id;
        } else {
          // 2. Insert kategori baru
          const [insertRes] = await db.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [categoryName]
          );
          categoryId = insertRes.insertId;
        }

        // 3. Insert ke destination_categories, hindari duplikat
        await db.execute(
          'INSERT IGNORE INTO destination_categories (destination_id, category_id) VALUES (?, ?)',
          [placeId, categoryId]
        );

        console.log(`berhasil menginput kategori placeid: ${placeId}, category: ${categoryId}`)
      } catch (err) {
        console.error(`❌ Gagal proses kategori "${categoryName}" untuk place ID ${placeId}:`, err.message);
      }
    }
  }

  console.log('✅ Import kategori selesai!');
};

importCategories().catch((err) => {
  console.error('❌ Fatal error:', err.message);
});