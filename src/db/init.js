import db from './database.js';

if (process.argv.includes('--reset')) {
  db.exec(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS destinations;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS cities;
    DROP TABLE IF EXISTS provinces;
    DROP TABLE IF EXISTS users;
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

  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT,
    category TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    detail_url TEXT,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT,
    rating INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    destination_id INTEGER,
    event_id INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );

  CREATE TABLE IF NOT EXISTS predicted_reviews (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id          INTEGER,
    destination_id   INTEGER NOT NULL,
    predicted_rating INTEGER CHECK(predicted_rating BETWEEN 1 AND 5),
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
  );
  
  CREATE TABLE IF NOT EXISTS destination_photos (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL,
    photo_url      TEXT NOT NULL,
    is_gallery     INTEGER DEFAULT 1, 
    position       INTEGER,           
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS destination_categories (
    destination_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (destination_id, category_id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);