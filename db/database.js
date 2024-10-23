const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:'); // Use ':memory:' for an in-memory database or 'finance.db' for a file-based database

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
    )`);
});

module.exports = db;
