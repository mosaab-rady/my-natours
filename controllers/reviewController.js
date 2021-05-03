const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  if (req.params.userId) filter = { user: req.params.userId };
  // get all reviews and populate users (name,photo)
  const reviews = await Review.find(filter)
    .populate('user', 'name photo')
    .populate('tour', 'name');
  // send reviews
  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      reviews,
    },
  });
});

// get review
exports.getReviewById = catchAsync(async (req, res, next) => {
  // 1) get review id from params
  const reviewId = req.params.id;
  // 2) get the review and populate tour name,user name and user photo
  const review = await Review.findById(reviewId)
    .populate('tour', 'name')
    .populate('user', 'name photo');
  // 3) check if the document exist
  if (!review) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // 4) send the document
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

// create review
exports.createReview = catchAsync(async (req, res, next) => {
  // // 1) get the tour id from params
  // req.body.tour = req.params.id;
  // // 2) get the user id from protect
  // req.body.user = req.user.id;
  // 3) create the review
  const review = await Review.create(req.body);
  // 4) send back the review
  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

// update review
exports.updateReviewById = catchAsync(async (req, res, next) => {
  // 1) get review id
  const { id } = req.params || req.body.id;
  const body = {};
  body.review = req.body.review;
  body.rating = req.body.rating;
  // 2) update the review
  const review = await Review.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })
    .populate('tour', 'name')
    .populate('user', 'name photo');
  // 3) check if the review exist
  if (!review) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // 4) send the updated review
  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReviewByid = catchAsync(async (req, res, next) => {
  // 1) get the id
  const { id } = req.params;
  // 2) check if the review exist
  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // 3) delete the review
  await Review.findByIdAndDelete(id);
  // 4) send response
  res.status(204).json({
    status: 'success',
    data: { review },
  });
});
