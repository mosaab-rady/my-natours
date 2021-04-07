const Tour = require('../models/tourModel');

// get all tours
exports.getAllTours = async (req, res, next) => {
  try {
    // find all the tours in database
    const tours = await Tour.find();
    // send the tours
    res.status(200).json({
      status: 'success',
      data: {
        result: tours.length,
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// create new tour
exports.createTour = async (req, res, next) => {
  try {
    // get the new tour info from the body
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// get tour
exports.getTourById = async (req, res, next) => {
  try {
    // get the tour id from the url params
    const { id } = req.params;
    // check if the tour exist
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};
// delete tour
exports.deleteTourById = async (req, res, next) => {
  try {
    // get the tour id from the url params
    const { id } = req.params;
    // check if the tour exist
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }
    // delete the tour
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// update the tour
exports.updateTourById = async (req, res, next) => {
  try {
    // get the tour id from the url params
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    // check if the tour exist
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};
