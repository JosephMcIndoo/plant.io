import { db } from ".";

db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT,
    message TEXT
);`);

db.run(`CREATE TABLE IF NOT EXISTS moisture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT,
    value INTEGER
);`);

db.run(`CREATE TABLE IF NOT EXISTS light (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT,
    value INTEGER
);`);

//SQLite does not support date/time types, so we use TEXT instead. All dates should be in ISO8601
