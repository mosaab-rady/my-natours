const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
