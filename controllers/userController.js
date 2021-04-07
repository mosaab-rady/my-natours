const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// sign up or create new user
exports.signUp = async (req, res, next) => {
  try {
    // create new user from the requested body
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: 'success',
      data: { newUser },
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

// log in function
exports.logIn = async (req, res, next) => {
  try {
    // getting the email and the password from the request body
    const { email, password } = req.body;
    // check if there are email and password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        data: 'Please provide email and password',
      });
    }
    // get the user from the database and select the password
    const user = await User.findOne({ email }).select('+password');

    // checks if the email and password are correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        data: 'Incorrect email or password',
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
