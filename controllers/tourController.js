const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const url = process.env.DATABASE;
const gridFsStorage = require('multer-gridfs-storage');

const multerStorage = new gridFsStorage({
  url,
  file: (req, file) => {
    return {
      filename: `tour_${Date.now()}.jpeg`,
      bucketName: 'photos',
    };
  },
  options: { useUnifiedTopology: true },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = req.files.imageCover[0].filename;
  }

  if (req.files.images) {
    req.body.images = [];
    req.files.images.map((img) => req.body.images.push(img.filename));
  }
  // await sharp(req.files.imageCover[0].buffer)
  //   .resize(2000, 1333)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/tours/${req.body.imageCover}`);

  // // 2) Images
  // req.body.images = [];

  // await Promise.all(
  //   req.files.images.map(async (file, i) => {
  //     const filename = `tour-${Date.now()}-${i + 1}.jpeg`;

  //     await sharp(file.buffer)
  //       .resize(2000, 1333)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`public/img/tours/${filename}`);

  //     req.body.images.push(filename);
  //   })
  // );

  next();
});

// get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  // find all the tours in database
  const tours = await Tour.find().populate('guides');
  // send the tours
  res.status(200).json({
    status: 'success',
    data: {
      result: tours.length,
      tours,
    },
  });
});

// create new tour
exports.createTour = catchAsync(async (req, res, next) => {
  // get the new tour info from the body
  const form = {};
  form.name = req.body.name;
  form.duration = req.body.duration;
  form.price = req.body.price;
  form.maxGroupSize = req.body.maxGroupSize;
  form.difficulty = req.body.difficulty;
  form.summary = req.body.summary;
  form.startDates = req.body.startDates;
  form.description = req.body.description;
  form.images = req.body.images;
  form.imageCover = req.body.imageCover;

  // we need to parse because the location are strings
  const startLocation = JSON.parse(req.body.startLocation);
  req.body.startLocation = startLocation;

  let locations = req.body.locations;
  // in case there only one location
  if (typeof locations !== 'string') {
    locations = locations.map((location) => JSON.parse(location));
  }
  if (typeof locations === 'string') {
    locations = JSON.parse(locations);
  }

  req.body.locations = locations;

  form.startLocation = req.body.startLocation;
  form.locations = req.body.locations;

  form.guides = req.body.guides;

  // console.log(form.locations[3].coordinates);

  const tour = await Tour.create(form);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// get tour
exports.getTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;
  // check if the tour exist and find it
  const tour = await Tour.findById(id).populate('guides').populate('reviews');
  if (!tour) {
    return next(new AppError('No Tour found with that ID.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
// delete tour
exports.deleteTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;
  // check if the tour exist
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(new AppError('No document found with that ID.', 404));
  }
  // delete the tour
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// update the tour
exports.updateTourById = catchAsync(async (req, res, next) => {
  // get the tour id from the url params
  const { id } = req.params;

  const form = {};
  form.name = req.body.name;
  form.duration = req.body.duration;
  form.price = req.body.price;
  form.maxGroupSize = req.body.maxGroupSize;
  form.difficulty = req.body.difficulty;
  form.summary = req.body.summary;
  if (req.body.startDates) form.startDates = req.body.startDates;
  form.description = req.body.description;
  if (req.body.images) form.images = req.body.images;
  if (req.body.imageCover) form.imageCover = req.body.imageCover;

  // we need to parse because the location are strings
  const startLocation = JSON.parse(req.body.startLocation);
  req.body.startLocation = startLocation;

  let locations = req.body.locations;
  // in case there only one location
  if (typeof locations !== 'string') {
    locations = locations.map((location) => JSON.parse(location));
  }
  if (typeof locations === 'string') {
    locations = JSON.parse(locations);
  }

  req.body.locations = locations;

  form.startLocation = req.body.startLocation;
  form.locations = req.body.locations;

  form.guides = req.body.guides;

  const tour = await Tour.findByIdAndUpdate(id, form, {
    new: true,
    runValidators: true,
  });
  // check if the tour exist
  if (!tour) {
    return next(new AppError('No document found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
