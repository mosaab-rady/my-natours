const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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
    // httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.httpOnly = true;
  }
  // send cookie
  res.cookie('jwt_server', token, cookieOptions);
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
exports.signUp = catchAsync(async (req, res, next) => {
  // create new user from the requested body
  const form = {};
  form.name = req.body.name;
  form.email = req.body.email;
  form.password = req.body.password;
  form.passwordConfirm = req.body.passwordConfirm;
  if (req.file) form.photo = req.file.filename;

  const newUser = await User.create(form);
  // create token and send cookie to make the user log in after sign up
  createTokenSendCookie(newUser, 201, res);
});

// log in function
exports.logIn = catchAsync(async (req, res, next) => {
  // getting the email and the password from the request body
  const { email, password } = req.body;
  // check if there are email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }
  // get the user from the database and select the password
  const user = await User.findOne({ email }).select('+password');
  // checks if the email and password are correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }
  // create token and send coockie for the user
  createTokenSendCookie(user, 200, res);
});

// log out
exports.logOut = (req, res, next) => {
  res.cookie('jwt_server', 'loggedout', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user document
  const user = await User.findById(req.user.id).select('+password');
  // compare the password
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // log user in
  createTokenSendCookie(user, 200, res);
});

// protect middleware to make only looged in user open access the protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // check if there is a cookie in the req
  const token = req.cookies.jwt_server;
  if (!token) {
    return next(
      new AppError('You are not logged in!! please log in to get access.', 401)
    );
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
    return next(new AppError('invalid token!.', 401));
  }
  // check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // grant access to protected routes
  req.user = user;
  next();
});

// prevent normal users from accessing the admin routes
// use protect first
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if the user have permission
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    // if yes call the next middleware
    next();
  };
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt_server) {
    const decoded = await jwt.verify(
      req.cookies.jwt_server,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          return 'invalid token';
        }
        return decoded;
      }
    );
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }
  next();
});
