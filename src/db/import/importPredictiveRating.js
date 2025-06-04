import fs from 'fs';
import csv from 'csv-parser';
import db from '../database.js'; 

const csvFilePath = '../eco_rating.csv'; 

const insertPredictedReview = db.prepare(`
  INSERT INTO predicted_reviews (user_id, destination_id, predicted_rating)
  VALUES (?, ?, ?)
`);

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const userId = parseInt(row.user_id);
    const destinationId = parseInt(row.place_id);
    const rating = parseInt(row.user_rating);

    if (!isNaN(userId) && !isNaN(destinationId) && !isNaN(rating)) {
      insertPredictedReview.run(userId, destinationId, rating);
    }
  })
  .on('end', () => {
    console.log('✅ Import predicted_reviews selesai!');
  })
  .on('error', (err) => {
    console.error('❌ Gagal mengimpor:', err.message);
  });