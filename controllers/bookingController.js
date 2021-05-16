const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) next(new AppError('can not book tour that does not exist', 404));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/bookings/checkout-success/?tour=${tour._id}&user=${
    //   req.user.id
    // }&price=${tour.price}`,
    success_url: `${req.protocol}://localhost:3000/myaccount`,
    cancel_url: `${req.protocol}://localhost:3000/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        // images: [`http://localhost:5000/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: { session },
  });
});

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.log(err);
  }

  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntent = event.data.object;
  //     console.log(paymentIntent);
  //     console.log('PaymentIntent was successful!');
  //     break;
  //   case 'payment_method.attached':
  //     const paymentMethod = event.data.object;
  //     console.log(paymentMethod);
  //     console.log('PaymentMethod was attached to a Customer!');
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  if (event.type === 'checkout.session.completed') {
    // console.log(event.data.object);
    createBookingCheckout(event.data.object);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // 1) get the user
  const user = req.user.id;

  // get the bookings
  const bookings = await Booking.find({ user });

  // get the tours
  const tourIds = bookings.map((booking) => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // return tours
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).json({
    status: 'success',
    data: {
      result: bookings.length,
      bookings,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const form = {};
  form.tour = req.body.tour;
  form.user = req.body.user || req.user.id;
  form.price = req.body.price;

  // if the tour does not exist
  const tour = await Tour.findById(form.tour);
  if (!tour) {
    return next(new AppError('The tour you want to book does not exist', 404));
  }

  const newBooking = await Booking.create(form);
  res.status(201).json({
    status: 'success',
    data: { newBooking },
  });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // get the booking
  const booking = await Booking.findById(id);
  // if no booking
  if (!booking) {
    return next(new AppError('No Booking found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.deleteBookingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError('No Booking found', 404));
  }

  await Booking.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
  });
});
exports.updateBookingById = catchAsync(async (req, res, next) => {});

exports.hasBookedToor = catchAsync(async (req, res, next) => {
  // get the user and tour
  const user = req.user.id;
  const tour = req.params.tourId;

  const booking = await Booking.findOne({ user, tour });
  if (!booking) return next(new AppError('please book the tour first', 400));

  next();
});
