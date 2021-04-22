const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/tours/:tourImage', fileController.getImage);
router.get('/users/:userImage', fileController.getImage);
router.get('/logo/:logoImage', fileController.getImage);

module.exports = router;
