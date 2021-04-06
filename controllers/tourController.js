const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: {
        result: tours.length,
        tours,
      },
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.createTour = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log(err);
  }
  next();
};
