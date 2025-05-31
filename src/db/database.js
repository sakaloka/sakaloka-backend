import Database from 'better-sqlite3';

const db = new Database('sakaloka.db', { verbose: console.log });

export default db;