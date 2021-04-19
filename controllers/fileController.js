const path = require('path');

exports.getImage = (req, res, next) => {
  const options = {
    root: path.join(__dirname, '../public/img/tours'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  const fileName = req.params.tourImage;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.status(404).json({
        status: 'fail',
        data: 'No Photo',
      });
    }
  });
};
