const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// create the token
const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createTokenSendCookie = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // send cookie
  res.cookie('jwt', token, cookieOptions);
  // remove password from output
  user.password = undefined;
  // send the output
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

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
    // create token and send cookie to make the user log in after sign up
    createTokenSendCookie(newUser, 201, res);
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
    // create token and send coockie for the user
    createTokenSendCookie(user, 200, res);
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
