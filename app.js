const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// allow requests from front end
// allow access from anywhere
app.use(cors());
app.options('*', cors());

// middleware for development logger
app.use(morgan('dev'));

// parse staitc files, json files, url
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.get('/public/img/tours/:tourImage', (req, res, next) => {
  const options = {
    root: path.join(__dirname, 'public/img/tours'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  const fileName = req.params.tourImage;
  res.sendFile(fileName, options, (err) => {
    if (err) console.log(err);
    else console.log('sent file');
  });
});

module.exports = app;
