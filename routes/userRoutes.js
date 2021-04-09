const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { route } = require('./tourRoutes');

const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/logIn', authController.logIn);
router.get('/logOut', authController.logOut);

router.use(authController.protect, authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById);

module.exports = router;
