const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const bookingController = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router.post(
  '/addreview/:tourId',
  authController.protect,
  reviewController.getTourUserIds,
  bookingController.hasBookedToor,
  reviewController.createReview
);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.getTourUserIds,
    reviewController.createReview
  );

router.use(authController.protect);
router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReviewById)
  .delete(reviewController.deleteReviewByid);

module.exports = router;
