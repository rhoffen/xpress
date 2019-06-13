const express = require('express');
const issuesRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

let seriesId;

issuesRouter.use((req, res, next) => {
    seriesId = req.params.seriesId;
    next();
});

issuesRouter.get('/', (req, res, next) => {
    // seriesId = req.params.seriesId;
    db.all(`SELECT * FROM Issue WHERE series_id = ${seriesId}`, (err, rows) => {
        if (err) {next(err)};
        return res.status(200).json({issues: rows});
    });
});

issuesRouter.post('/', (req, res, next) => {
    const {name, issueNumber, publicationDate, artistId} = req.body.issue;
    db.get(`SELECT * from Artist WHERE id = ${artistId}`, (err, row) => {
        if (err) {next(err)};
        if (!row || !name || !issueNumber || !publicationDate) {
            return res.sendStatus(400);
        }
        db.run(`INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)`, {
            $name: name,
            $issueNumber: issueNumber,
            $publicationDate: publicationDate,
            $artistId: artistId,
            $seriesId: seriesId
        }, function(err) {
                if (err) {next(err)};
                db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, row) => {
                    if (err) {next(err)};
                    return res.status(201).json({issue: row});
                });
        });
    });
});


module.exports = issuesRouter;