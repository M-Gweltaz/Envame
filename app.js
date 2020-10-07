//  Importing packages
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Loading config env variablesnpm
dotenv.config({ path: './config/config.env' });
// Starting the server
const app = express();

// HTTP request logger on dev mode only
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Enabling static files
app.use(express.static('public'));

//  Serverside template engine
app.set('view engine', 'ejs');

// Server listening PORT
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port : ${PORT}`
  )
);

// Setting Routes

// Homepage
const homePagePath = require('./routes/homepage.js');
app.use('/', homePagePath);
