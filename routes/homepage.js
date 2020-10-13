//  Importing packages
const express = require('express');
const router = express.Router();

// Homepage ROOT
router.get('/', (req, res) => {
  res.render('homepage');
});


module.exports = router;
