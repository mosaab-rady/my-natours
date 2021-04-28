const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  // find all the tours in database
  const tours = await Tour.find();
  // send the tours
  res.status(200).json({
    status: 'success',
    data: {
      result: tours.length,
      tours,
    },
  });
});

// create new tour
exports.createTour = catchAsync(async (req, res, next) => {
  // get the new tour info from the body
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// get tour
exports.getTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;
  // check if the tour exist and find it
  const tour = await Tour.findById(id).populate('guides').populate('reviews');
  if (!tour) {
    return next(new AppError('No Tour found with that ID.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
// delete tour
exports.deleteTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;
  // check if the tour exist
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // delete the tour
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// update the tour
exports.updateTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  // check if the tour exist
  if (!tour) {
    return next(new AppError('No document found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
