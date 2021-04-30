const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { route } = require('./tourRoutes');

const router = express.Router();

router.post(
  '/signUp',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.signUp
);

router.post('/logIn', authController.logIn);

router.get('/logOut', authController.logOut);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.use(authController.protect);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUserById
);

router.get('/', userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById);

module.exports = router;
