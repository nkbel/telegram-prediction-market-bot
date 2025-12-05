import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/database.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Promisify database methods
db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));

// Custom wrapper for db.run to preserve lastID
const originalRun = db.run.bind(db);
db.run = function(sql, params) {
  return new Promise((resolve, reject) => {
    originalRun(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

function initializeTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      balance REAL DEFAULT 1000.0,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(console.error);

  // Events table
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolves_at DATETIME,
      status TEXT DEFAULT 'active',
      outcome TEXT
    )
  `).catch(console.error);

  // Bets table
  db.run(`
    CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      outcome TEXT NOT NULL,
      shares REAL NOT NULL,
      price_per_share REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `).catch(console.error);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id)`).catch(console.error);
  db.run(`CREATE INDEX IF NOT EXISTS idx_bets_event_id ON bets(event_id)`).catch(console.error);
}

export default db;

