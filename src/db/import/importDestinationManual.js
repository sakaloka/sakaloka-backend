import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import moment from 'moment-timezone';
import db from '../database.js'; 

dotenv.config();

const { OPENCAGE_KEY } = process.env;
if (!OPENCAGE_KEY) throw new Error('OPENCAGE_KEY not found in .env');

const CSV_PATH = '../manual-dest.csv';
const limit = pLimit(1);

/* ------- helper DB ------- */
async function getOrInsertCityAndProvinceGeocoded(cityName) {
  // Geocode city
  const { data } = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
    params: {
      q: cityName + ', Indonesia',
      key: OPENCAGE_KEY,
      limit: 1
    }
  });

  if (!data.results.length) throw new Error(`Geocode not found for city: ${cityName}`);

  const components = data.results[0].components;

  const provinceMapping = {
    "Aceh": "Aceh",
    "North Sumatra": "Sumatera Utara",
    "West Sumatra": "Sumatera Barat",
    "Riau": "Riau",
    "Riau Islands": "Kepulauan Riau",
    "Jambi": "Jambi",
    "South Sumatra": "Sumatera Selatan",
    "Bangka Belitung Islands": "Kepulauan Bangka Belitung",
    "Bengkulu": "Bengkulu",
    "Lampung": "Lampung",
    "Banten": "Banten",
    "Jakarta": "DKI Jakarta",
    "West Java": "Jawa Barat",
    "Central Java": "Jawa Tengah",
    "Special Region of Yogyakarta": "Daerah Istimewa Yogyakarta",
    "East Java": "Jawa Timur",
    "Bali": "Bali",
    "West Kalimantan": "Kalimantan Barat",
    "Central Kalimantan": "Kalimantan Tengah",
    "South Kalimantan": "Kalimantan Selatan",
    "East Kalimantan": "Kalimantan Timur",
    "North Kalimantan": "Kalimantan Utara",
    "North Sulawesi": "Sulawesi Utara",
    "Central Sulawesi": "Sulawesi Tengah",
    "South Sulawesi": "Sulawesi Selatan",
    "Southeast Sulawesi": "Sulawesi Tenggara",
    "West Sulawesi": "Sulawesi Barat",
    "Gorontalo": "Gorontalo",
    "Maluku": "Maluku",
    "North Maluku": "Maluku Utara",
    "West Papua": "Papua Barat",
    "South Papua": "Papua Selatan",
    "Central Papua": "Papua Tengah",
    "Highland Papua": "Papua Pegunungan",
    "Papua": "Papua",
    "West Nusa Tenggara": "Nusa Tenggara Barat",
    "East Nusa Tenggara": "Nusa Tenggara Timur",
  };  

  // Ambil provinsi dari hasil geocoding
  const rawProvince = components.state || components.region || components.county || 'Unknown';
  const provinceName = provinceMapping[rawProvince] || rawProvince;

  if (!provinceMapping[rawProvince]) {
    console.warn(`⚠️ Provinsi tidak dikenali: ${rawProvince}`);
  }  

  // Masukkan ke table provinces
  const [provRows] = await db.execute(
    'SELECT id FROM provinces WHERE name = ?', [provinceName]
  );
  let provinceId;
  if (provRows.length > 0) {
    provinceId = provRows[0].id;
  } else {
    const [result] = await db.execute(
      'INSERT INTO provinces (name) VALUES (?)', [provinceName]
    );
    provinceId = result.insertId;
  }

  // Masukkan ke table cities
  const [cityRows] = await db.execute(
    'SELECT id FROM cities WHERE name = ? AND province_id = ?', [cityName, provinceId]
  );
  if (cityRows.length > 0) return cityRows[0].id;

  const [result] = await db.execute(
    'INSERT INTO cities (name, province_id) VALUES (?, ?)',
    [cityName, provinceId]
  );
  return result.insertId;
}

async function insertDestination({ id, name, cityId, lat, lng, desc, mainPhoto }) {
  const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

  await db.execute(`
    INSERT IGNORE INTO destinations
    (id, name, city_id, latitude, longitude, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, name, cityId, lat, lng, desc, now, now]);

  await db.execute(`
    INSERT IGNORE INTO destination_photos
    (destination_id, photo_url, is_gallery, position)
    VALUES (?, ?, 0, 0)
  `, [id, mainPhoto]);

  return id;
}

async function insertGallery(destId, photos) {
  let pos = 1;
  for (const url of photos.filter(Boolean)) {
    await db.execute(`
      INSERT INTO destination_photos (destination_id, photo_url, position)
      VALUES (?, ?, ?)
    `, [destId, url, pos++]);
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
          const cityId = await getOrInsertCityAndProvinceGeocoded(place.city);

          const destId = await insertDestination({
            id: Number(place.place_id),
            name: place.place_name,
            cityId,
            lat: place.latitude,
            lng: place.longitude,
            desc: place.place_description,
            mainPhoto: place.place_img,
          });

          await insertGallery(destId, [
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