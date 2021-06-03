const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// upload user photo
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}.jpeg`;
  const photoSharp = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, `../public/img/users/${req.file.filename}`));

  next();
});

// update user name and email
exports.updateMe = catchAsync(async (req, res, next) => {
  // we will get the user from the protect route(req.user)

  //create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update.', 400));
  }
  // update the user document
  const form = {};
  form.name = req.body.name;
  form.email = req.body.email;
  if (req.file) form.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, form, {
    new: true,
    runValidators: true,
  });
  // send the updated document
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
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
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// get user
exports.getUserById = catchAsync(async (req, res, next) => {
  // get id from teh url params
  const { id } = req.params;
  // check if the user exist
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('No document found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// delete user
exports.deleteUserById = catchAsync(async (req, res, next) => {
  // get the id from the url params
  const { id } = req.params;
  // get the user from database
  const user = await User.findById(id);
  // check if the user exist
  if (!user) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // delete the user
  await User.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  // get the id from the url params
  const { id } = req.params;
  // get the user from database
  const user = await User.findById(id);
  // check if the user exist
  if (!user) {
    return next(new AppError('No document found with that ID.', 404));
  }
  const role = req.body.role;
  // update the user
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: role },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});
