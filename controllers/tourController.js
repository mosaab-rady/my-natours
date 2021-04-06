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
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
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
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

exports.getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
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

exports.deleteTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }
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

exports.updateTourById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

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
