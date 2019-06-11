const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4000;

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./api/api.js');
app.use('/api', apiRouter);

const errorhandler = require('errorhandler');
app.use(errorhandler())

app.listen(PORT, err => {
    if (err) {
        console.log(err)
    }
    console.log(`Server is listening on port ${PORT}`);
});

