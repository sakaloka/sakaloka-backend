import fs from 'fs';
import readline from 'readline';
import db from './database.js';


const insert = db.prepare(`
  INSERT INTO events 
    (title, location, category, start_date, end_date, description, detail_url) 
  VALUES 
    (@title, @location, @category, @start_date, @end_date, @description, @detail_url)
`);

async function importCSV(path) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) {
      isHeader = false; 
      continue;
    }

    const cols = line.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const data = cols.map(c => c.trim().replace(/^"|"$/g, ''));

    // Map sesuai kolom tabel
    const event = {
      title: data[0] || null,
      location: data[1] || null,
      category: data[2] || null,
      start_date: data[3] || null,
      end_date: data[4] || null,
      description: data[5] || null,
      detail_url: data[6] || null,
    };

    insert.run(event);
  }
  console.log('Import selesai!');
}

importCSV('D:/rivazhr/Kuliah/DBS CODING CAMP/Tugas Submisi/Capstone/events.csv').catch(console.error);