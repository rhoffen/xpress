const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS "Artist" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"date_of_birth"	TEXT NOT NULL,
	"biography"	INTEGER NOT NULL,
	"is_currently_employed"	INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY("id")
);`);

