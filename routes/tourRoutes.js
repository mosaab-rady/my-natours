const express = require('express');
const { getAllTours, createTour } = require('../controllers/tourController');

const router = express.Router();

router.get('/', getAllTours);
router.post('/', createTour);

module.exports = router;
