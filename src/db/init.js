import db from './database.js';

if (process.argv.includes('--reset')) {
  db.exec(`
    DROP TABLE IF EXISTS cities;
    DROP TABLE IF EXISTS provinces;
  `); 
}

db.exec(`
  CREATE TABLE IF NOT EXISTS provinces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  ); 

  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    province_id INTEGER,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);