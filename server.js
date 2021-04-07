const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE;

// connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const port = process.env.PORT || 5000;

// listen on the server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});
