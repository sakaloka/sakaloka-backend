import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import moment from 'moment-timezone'
import db from '../database.js';

dotenv.config();
const { OPENCAGE_KEY } = process.env;
if (!OPENCAGE_KEY) throw new Error('OPENCAGE_KEY not found in .env');

const CSV_PATH = '../manual-dest.csv';
const limit = pLimit(1); // limit 1 geocode request at a time

/* ------- helper DB ------- */
function getOrInsertCity(cityName) {
  const existing = db.prepare('SELECT id FROM cities WHERE name = ?').get(cityName);
  if (existing) return existing.id;

  const result = db.prepare(
    'INSERT INTO cities (name, province_id) VALUES (?, NULL)'
  ).run(cityName);
  return result.lastInsertRowid;
}

function insertDestination({ id, name, cityId, lat, lng, desc, mainPhoto }) {
  const now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

  db.prepare(`
    INSERT OR IGNORE INTO destinations
    (id, name, city_id, latitude, longitude, description, created_at, updated_at)
    VALUES (?,  ?,    ?,       ?,         ?,          ?,           ?, ?)
  `).run(id, name, cityId, lat, lng, desc, now, now);

  /* simpan foto utama */
  db.prepare(`
    INSERT OR IGNORE INTO destination_photos
    (destination_id, photo_url, is_gallery, position)
    VALUES (?, ?, 0, 0)
  `).run(id, mainPhoto);

  return id;
}

function insertGallery(destId, photos) {
  let pos = 1;
  const stmt = db.prepare(`
    INSERT INTO destination_photos (destination_id, photo_url, position)
    VALUES (?, ?, ?)`);
  for (const url of photos.filter(Boolean)) {
    stmt.run(destId, url, pos++);
  }
}

/* ------- helper Geocoding ------- */
async function geocodeLocation(query) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_KEY}&limit=1`;
  const res = await axios.get(url);
  if (res.data.results.length === 0) throw new Error('Geocode not found');
  const { lat, lng } = res.data.results[0].geometry;
  return { lat, lng };
}

/* ------- main import ------- */
function importCSV() {
  const rows = [];
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      console.log(`⏳ Memproses ${rows.length} tempat ...`);

      for (const place of rows) {
        try {
          const cityId = getOrInsertCity(place.city);

          const destId = insertDestination({
            id: Number(place.place_id),
            name: place.place_name,
            cityId,
            lat: place.latitude,
            lng: place.longitude,
            desc: place.place_description,
            mainPhoto: place.place_img,
          });

          insertGallery(destId, [
            place.gallery_photo_img1,
            place.gallery_photo_img2,
            place.gallery_photo_img3
          ]);

          console.log(`✅ ${place.place_name} (id=${destId})`);
        } catch (err) {
          console.error(`❌ ${place.place_name}:`, err.message);
        }
      }

      console.log('🎉 Import selesai!');
      process.exit(0);
    });
}

importCSV();