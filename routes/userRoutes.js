const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById);

router.post('/signUp', userController.signUp);
router.post('/logIn', userController.logIn);

module.exports = router;
