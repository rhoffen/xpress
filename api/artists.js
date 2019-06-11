const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Artist WHERE is_currently_employed = 1`, (err, rows) => {
        if (err) {
            next(err);
        }
        return res.status(200).json({artists: rows});
    });
});

artistsRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;
    db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, row) => {
        if (err) {
            next(err);
        } else if (!row) {
            return res.status(404).send();
        }
        return res.status(200).json({artist: row});
    })
});

module.exports = artistsRouter;