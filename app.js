const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');

const app = express();

// middleware for development logger
app.use(morgan('dev'));

// parse staitc files, json files, url
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/tours', tourRouter);

module.exports = app;
