//  Importing packages
const express = require('express');
const router = express.Router();

// x-www-form-urlencoded parser
const urlencodedParser = express.urlencoded({ extended: false });

// Homepage ROOT
router.get('/', (req, res) => {

  res.render('homepage', { newsletterEmail : req.newsletterEmail })
});

router.post('/newsletter', urlencodedParser, (req, res) => {
  // Newsletter subscription to do

  req.newsletterEmail = req.body.email
  res.render('homepage', { newsletterEmail : req.newsletterEmail })
});




module.exports = router;
