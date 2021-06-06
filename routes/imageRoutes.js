const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/tours/:filename', fileController.getImage);
router.get('/users/:filename', fileController.getImage);
router.get('/logo/:logoImage', fileController.getImage);

module.exports = router;
