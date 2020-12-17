const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');


router.get('/', (req, res) => {
  res.render('contact')
})

router.post('/form', [
  // data sanitization and validation
  body('firstName')
    .trim()
    .custom(firstName => {
      if(/^([-,A-Za-zÀ-ÿ. ']+[ ]*){2,30}/.test(firstName)) { return true; }
    })
    .withMessage('Champ prénom invalide, veuillez réessayer'),
  body('lastName')
    .trim()
    .custom(lastName => {
      if(/^([-,A-Za-zÀ-ÿ. ']+[ ]*){2,30}/.test(lastName)) { return true; }
    })
    .withMessage('Champ nom invalide, veuillez réessayer'),
  body('email')
    .custom(email => {
      if(/^[\w-\.À-ÿ]{2,40}@[\wÀ-ÿ]{2,25}\.[a-zA-Z]{2,4}$/.test(email)) { return true }
    })
    .withMessage('Champ email invalide, veuillez réessayer'),
  body('smartphone')
    .trim()
    .custom(smartphone => {
      if(/^([0-9 +.()-]{0,15})/.test(smartphone)) { return true; }
    })
    .withMessage('Champ téléphone invalide, veuillez réessayer'),
  body('message')
    .trim()
    .custom(message => {
      if(/^[-,A-Za-zÀ-ÿ. '!€:@]+$/.test(message)) { return true; }
    })
    .withMessage('Champ message invalide, veuillez réessayer')
], (req, res) => {
  let fetchResult // result of the request to be send as Json

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    fetchResult = 'badInput'
    return res.status(400).json({ errors: errors.array(), fetchResult });
  }
  
  const data = req.body
  
  // Data validated
  fetchResult = 'success'

  // mail input
  const output = `<h1>Vous avez reçu un message de ${data.firstName} ${data.lastName}</h1>
  <h3>Son contact:</h3>
  <p>email: ${data.email}</p>
  <p>téléphone: ${data.phone}</p>
  <h3>Son message:</h3>
  <p>${data.message}</p>`

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'node9-fr.n0c.com',
    port: 465,
    secure: true, // true for 465, false for other ports (587)
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  // send mail with defined transport object
  let mailOption = {
    from: '"Envame contact form" <contact@envame.com>',
    to: process.env.EMAIL_CONTACT_RECEIVER, 
    subject: 'Contact form',
    text: 'Hello world?', 
    html: output, 
  };

  // sending welcome newsletter email
  transporter.sendMail(mailOption);
  res.json({
    status : fetchResult,
  })
})

module.exports = router