const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTourById)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTourById
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTourById
  );

module.exports = router;
