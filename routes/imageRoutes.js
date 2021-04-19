const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/:tourImage', fileController.getImage);

module.exports = router;
