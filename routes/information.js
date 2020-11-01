//  Importing packages
const express = require('express');
const router = express.Router();

// information ROOT
router.get('/', (req, res) => {
  res.render('information');
});


module.exports = router;
