const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

seriesRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Series`, (err, rows) => {
        if (err) {
            next(err);
        }
        res.status(200).json({series: rows});
    });
});

seriesRouter.post('/', (req, res, next) => {
    const {name, description} = req.body.series;
 
    if (!name || !description) {
        return res.sendStatus(400);
    }

    const sqlInsert = `INSERT INTO Series (name, description) VALUES ($name, $description)`;
    const values = {$name: name, $description: description};

    db.run(sqlInsert, values, function(err) {
        if (err) {next(err)};
        
        db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (error, row) => {
            return res.status(201).json({series: row});
        });
    });
});

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
    const sql = 'SELECT * FROM Series WHERE Series.id = $seriesId';
    const values = {$seriesId: seriesId};
    db.get(sql, values, (error, series) => {
        if (error) {
            next(error);
        } else if (series) {
            req.series = series;
            next();
        } else {
            return res.sendStatus(404);
        }
    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    return res.status(200).json({series: req.series});
});

seriesRouter.put('/:seriesId', (req, res, next) => {
    const {name, description} = req.body.series;
    const id = req.params.seriesId;

    if (!name || !description) {
        return res.sendStatus(400);
    }

    const sql = 'UPDATE Series SET name = $name, description = $description WHERE id = $id';
    const values = {$name: name, $description: description, $id: id};

    db.run(sql, values, err => {
        if (err) {next(err)};
        db.get(`SELECT * FROM Series WHERE id=${id}`, (error, row) => {
            if (error) {next(error)};
            return res.status(200).json({series: row});
        })
    });
});


module.exports = seriesRouter;