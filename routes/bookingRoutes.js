const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/mybookings', bookingController.getMyBookings);

router.get('/checkout-session/:tourId', bookingController.getCheckOutSession);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBookingById)
  .delete(bookingController.deleteBookingById);

module.exports = router;
