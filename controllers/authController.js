const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
  res.cookie('jwt-react', token, cookieOptions);
  // remove password from output
  user.password = undefined;
  // send the output
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// sign up
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
    res.json({
      status: 'fail',
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

// log out
exports.logOut = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// update password
exports.updatePassword = async (req, res, next) => {
  try {
    // get user document
    const user = await User.findById(req.user.id).select('+password');
    // compare the password
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        status: 'fail',
        data: 'your current password is wrong',
      });
    }
    // update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // log user in
    createTokenSendCookie(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err.message,
    });
  }
};

// protect middleware to make only looged in user open access the protected routes
exports.protect = async (req, res, next) => {
  // check if there is a cookie in the req
  const token = req.cookies.jwt_server;
  if (!token) {
    return res.json({
      status: 'fail',
      data: 'you are not logged in, please log in to get access',
    });
  }
  // verify the cookie
  const decoded = await jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      if (err) {
        return 'invalid token';
      }
      return decoded;
    }
  );
  if (decoded === 'invalid token') {
    return res.status(401).json({
      status: 'fail',
      data: 'invalid token',
    });
  }
  // check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      data: 'the user belong to this token does not exist',
    });
  }
  // grant access to protected routes
  req.user = user;
  next();
};

// prevent normal users from accessing the admin routes
// use protect first
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user have permission
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        data: 'you do not have permission to perform this action',
      });
    }
    // if yes call the next middleware
    next();
  };
};
