const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { route } = require('./tourRoutes');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.post(
  '/signUp',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.signUp
);

router.post('/logIn', authController.logIn);

router.get('/logOut', authController.logOut);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.use(authController.protect);

router.use('/:userId/reviews', reviewRouter);

router.get('/isloggedin', authController.isLoggedIn);

router.get('/me', userController.getMe, userController.getUserById);

router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(authController.restrictTo('admin'), userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
