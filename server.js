const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
//console.log('process.env.NODE_ENV= ' + process.env.NODE_ENV);
//if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
 // }

app.use(cors);
app.use(morgan('dev'));

const apiRouter = require('./api/api.js');
app.use('/api', apiRouter);

app.listen(PORT, err => {
    if (err) {
        console.log(err)
    }
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;