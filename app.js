const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const imageRouter = require('./routes/imageRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// allow requests from front end
// allow access from anywhere
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.options('*', cors());

// middleware for development logger
app.use(morgan('dev'));

// parse staitc files, json files, url
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/public/img', imageRouter);

app.use(globalErrorHandler);

module.exports = app;
