import fs from 'fs';
import csv from 'csv-parser';
import db from '../database.js';

const csvFilePath = '../eco_rating.csv';

async function importPredictedReviews() {
  const rows = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      console.log(`⏳ Mengimpor ${rows.length} predicted reviews ...`);

      for (const row of rows) {
        const userId = parseInt(row.user_id);
        const destinationId = parseInt(row.place_id);
        const rating = parseInt(row.user_rating);

        if (!isNaN(userId) && !isNaN(destinationId) && !isNaN(rating)) {
          try {
            await db.execute(
              `INSERT INTO predicted_reviews (user_id, destination_id, predicted_rating)
              VALUES (?, ?, ?)`,
              [userId, destinationId, rating]
            );
          } catch (err) {
            console.error(`❌ Gagal insert user=${userId}, dest=${destinationId}: ${err.message}`);
          }
        }
      }

      console.log('✅ Import predicted_reviews selesai!');
      process.exit(0);
    })
    .on('error', (err) => {
      console.error('❌ Gagal membaca file:', err.message);
    });
}

importPredictedReviews();