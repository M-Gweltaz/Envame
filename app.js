//  Importing packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

 //Loading config env variablesnpm
dotenv.config({ path: './config/config.env' });

// Starting the server
const app = express();

// Connecting to DB
mongoose.set('useUnifiedTopology', true);
mongoose.connect( process.env.DB_CONNECT,
  { useNewUrlParser: true })


// Enabling static files
app.use(express.static('public'));

// Serverside template engine
app.set('view engine', 'ejs');

// Bodyparser for forms
app.use(express.urlencoded({ extended: false }))

app.use(express.json({ limit: '1mb' }))

// Server listening PORT
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running on port : ${PORT}`
  )
);

// Setting Routes
// Homepage
const homepagePath = require('./routes/homepage.js');
app.use('/', homepagePath);

// Contact
const contactPath = require('./routes/contact.js');
app.use('/contact', contactPath);

// CGV
const cgvPath = require('./routes/cgv.js');
app.use('/CGV', cgvPath);

// Privacy policy
const privacyPolPath = require('./routes/privacy-policy.js');
app.use('/privacy-policy', privacyPolPath);

// further-information
const infosPath = require('./routes/information.js');
app.use('/information', infosPath);

// paiement 
const checkOutPath = require('./routes/check-out.js')
app.use('/check-out', checkOutPath)