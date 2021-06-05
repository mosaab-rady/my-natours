const path = require('path');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const url = process.env.DATABASE;

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
connect.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: 'photos',
  });
});

exports.getImage = (req, res, next) => {
  let kind;
  let fileName;
  if (req.params.tourImage) {
    kind = 'tours';
    fileName = req.params.tourImage;
  }
  if (req.params.userImage) {
    kind = 'users';
    fileName = req.params.userImage;
  }
  if (req.params.logoImage) {
    kind = '';
    fileName = req.params.logoImage;
  }

  gfs.find({ filename: fileName }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'no files available',
      });
    }
    gfs.openDownloadStreamByName(fileName).pipe(res);
  });

  // const options = {
  //   root: path.join(__dirname, `../public/img/${kind}`),
  //   dotfiles: 'deny',
  //   headers: {
  //     'x-timestamp': Date.now(),
  //     'x-sent': true,
  //   },
  // };

  // res.sendFile(fileName, options, (err) => {
  //   if (err) {
  //     return next(new AppError('No photo found.', 404));
  //   }
  // });
};
