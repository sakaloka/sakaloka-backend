import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import db from '../database.js';
import 'moment/locale/id.js';
moment.locale('id');

dotenv.config();

const CSV_PATH = '../events.csv';

/* --- helper: insert or get province & city --- */
async function getOrInsertCityProvince(cityName, provinceName) {
  // Cek atau insert province
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

  // Cek atau insert city
  const [cityRows] = await db.execute(
    'SELECT id FROM cities WHERE name = ? AND province_id = ?', [cityName, provinceId]
  );
  if (cityRows.length > 0) {
    return cityRows[0].id;
  } else {
    const [result] = await db.execute(
      'INSERT INTO cities (name, province_id) VALUES (?, ?)',
      [cityName, provinceId]
    );
    return result.insertId;
  }
}

/* --- main import --- */
async function importEvents() {
  const rows = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      console.log(`⏳ Mengimpor ${rows.length} event ...`);

      for (const row of rows) {
        try {
          const {
            event_name,
            location,
            category,
            start_date,
            end_date,
            description,
            url_detail
          } = row;

          const [cityName, provinceName] = location.split('|').map(s => s.trim());

          const cityId = await getOrInsertCityProvince(cityName, provinceName);
          const start = moment(start_date, 'DD MMMM YYYY').format('YYYY-MM-DD');
          const end = moment(end_date, 'DD MMMM YYYY').format('YYYY-MM-DD');

          await db.execute(
            `INSERT INTO events
              (title, city_id, category, start_date, end_date, description, detail_url)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [event_name, cityId, category, start, end, description, url_detail]
          );

          console.log(`✅ ${event_name}`);
        } catch (err) {
          console.error(`❌ ${row.event_name}:`, err.message);
        }
      }

      console.log('🎉 Semua event selesai diimpor!');
      process.exit(0);
    });
}

importEvents();