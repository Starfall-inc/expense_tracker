const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DATABASE_PATH || './db/expense_tracker.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category_id INTEGER,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'expense',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Add some default categories if they don't exist
const defaultCategories = [
  { name: 'Food', user_id: null },
  { name: 'Transport', user_id: null },
  { name: 'Utilities', user_id: null },
  { name: 'Entertainment', user_id: null },
  { name: 'Healthcare', user_id: null },
  { name: 'Shopping', user_id: null },
  { name: 'Salary', user_id: null },
  { name: 'Freelance', user_id: null },
  { name: 'Investment', user_id: null },
  { name: 'Other', user_id: null }
];
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, user_id) VALUES (?, ?)');

const transaction = db.transaction((categories) => {
  for (const cat of categories) {
    insertCategory.run(cat.name, cat.user_id);
  }
});

transaction(defaultCategories);

module.exports = db;
