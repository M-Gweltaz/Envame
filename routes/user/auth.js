//  Importing packages
const express = require('express');
const router = express.Router();
const User = require('../../model/User');

// user/auth ROOT
router.get('/', (res, req) => {
  res.send('auth')
})

// register PATH
router.post('/register', (req, res) => {
  res.send('register')
})

// login path
router.post('login', (req, res) => {
  res.send('login')
})


module.exports = router