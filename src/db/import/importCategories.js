import fs from 'fs';
import csv from 'csv-parser';
import db from '../database.js';

const csvFilePath = '../eco_place.csv'; 

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
const getCategoryId = db.prepare('SELECT id FROM categories WHERE name = ?');
const insertDestinationCategory = db.prepare('INSERT INTO destination_categories (destination_id, category_id) VALUES (?, ?)');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const placeId = parseInt(row.place_id); 
    const categories = row.category.split(',').map(c => c.trim());

    categories.forEach(categoryName => {
      if (!categoryName) return;
      insertCategory.run(categoryName);

      const cat = getCategoryId.get(categoryName);
      if (!cat) return;

      insertDestinationCategory.run(placeId, cat.id);
    });
  })
  .on('end', () => {
    console.log('Import kategori selesai ✅');
  });
