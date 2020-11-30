const express = require('express')
const router = express.Router()

// Privacy-policy ROOT
router.get('/', (req, res) => {
  res.render('privacy-policy')
})

module.exports = router