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

artistsRouter.post('/', (req, res, next) => {
    const {name, dateOfBirth, biography, isCurrentlyEmployed} = req.body.artist;

    if (!name || !dateOfBirth || !biography) {
        return res.status(400).send();
    }

    db.run(`INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) 
        VALUES ($name, $date_of_birth, $biography, $is_currently_employed)`, {
            $name: name,
            $date_of_birth: dateOfBirth,
            $biography: biography,
            $is_currently_employed: isCurrentlyEmployed || 1
        }, function(err) {
            if (err) {
                next(err);
            }
            db.get(`SELECT * from Artist WHERE id = ${this.lastID}`, (err, row) => {
                return res.status(201).json({artist: row});
            });

        }
    )
});

artistsRouter.put('/:id', (req, res, next) => {
    const {name, dateOfBirth, biography, isCurrentlyEmployed} = req.body.artist;
    const id = req.params.id;
    
    if (!name || !dateOfBirth || !biography) {
        return res.status(400).send();
    }

    db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, row) => {
        if (!row) {
            return res.status(404).send();
        }
        db.run(`UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $id`, {
            $name: name,
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed || 1,
            $id: id
            }, err => {
                if (err) {
                    next(err)
                }
                db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, row) => {
                res.status(200).json({artist: row});
                });
            }
        )
    });
});

artistsRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, row) => {
        if (!row) {
            return res.status(404).send();
        }
        db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id = ${id}`, err => {
            db.get(`SELECT * FROM Artist WHERE id=${id}`, (err, row1) => {
                return res.status(200).send({artist: row1});
            });
        });  
    });
});

module.exports = artistsRouter;