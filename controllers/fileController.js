const path = require('path');

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
  const options = {
    root: path.join(__dirname, `../public/img/${kind}`),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.status(404).json({
        status: 'fail',
        data: 'No Photo',
      });
    }
  });
};
