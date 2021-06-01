const express = require('express');
const path = require('path');
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config({ path: `${__dirname}/config.env` });

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const imageRouter = require('./routes/imageRoutes');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController');
const helmet = require('helmet');

const app = express();

// Set security HTTP headers
app.use(helmet());

// allow requests from front end
// allow access from anywhere
if (process.env.NODE_ENV === 'production') {
  app.use(cors());
} else app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// const whitelist = ['http://localhost:3000', 'https://checkout.stripe.com'];
// const corsOptionsDelegate = function (req, callback) {
//   let corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

// app.use(cors(corsOptionsDelegate));
app.options('*', cors());

// middleware for development logger
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// parse staitc files, json files, url
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/public/img', imageRouter);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use(globalErrorHandler);

module.exports = app;
