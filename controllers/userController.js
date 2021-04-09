const User = require('../models/userModel');

// get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    // get all users from database
    const users = await User.find();
    // send the documnts
    res.status(200).json({
      status: 'success',
      data: {
        results: users.length,
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// get user
exports.getUserById = async (req, res, next) => {
  try {
    // get id from teh url params
    const { id } = req.params;
    // check if the user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// delete user
exports.deleteUserById = async (req, res, next) => {
  try {
    // get the id from the url params
    const { id } = req.params;
    // get the user from database
    const user = await User.findById(id);
    // check if the user exist
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: 'No document found with that ID',
      });
    }
    // delete the user
    await User.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};
