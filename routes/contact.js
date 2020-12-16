const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');


router.get('/', (req, res) => {
  res.render('contact')
})

router.post('/form', (req, res) => {
  const data = req.body
  let fetchResult 

  // Sanitation of the data
  const regexName = /^([-,A-Za-zÀ-ÿ. ']+[ ]*){2,30}/
  const regexPhone = /^([0-9 +.()-]{0,15})/
  const regexEmail = /^[\w-\.À-ÿ]{2,40}@[\wÀ-ÿ]{2,25}\.[a-zA-Z]{2,4}$/
  const regexMessage = /^([^/{}[\]$]{0,500})/
  
  // checking data
  if (!regexName.test(data.form.firstName)){
    fetchResult = 'invalidFirstnameInput'
    res.json({
      status : fetchResult,
    })
  }
  if (!regexName.test(data.form.lastName)){
    fetchResult = 'invalidLastnameInput'
    res.json({
      status : fetchResult,
    })
  }
  if (!regexEmail.test(data.form.email)){
    fetchResult = 'invalidEmailInput'
    res.json({
      status : fetchResult,
    })
  }
  if (!regexPhone.test(data.form.smartphone)){
    fetchResult = 'invalidPhoneInput'
    res.json({
      status : fetchResult,
    })
  }

  if (!regexMessage.test(data.form.Message)){
    fetchResult = 'invalidMessageInput'
    res.json({
      status : fetchResult,
    })
  }
  // Data validated
  fetchResult = 'success'

  // mail input
  const output = `<h1>Vous avez reçu un message de ${data.form.firstName} ${data.form.lastName}</h1>
  <h3>Son contact:</h3>
  <p>email: ${data.form.email}</p>
  <p>téléphone: ${data.form.smartphone}</p>
  <h3>Son message:</h3>
  <p>${data.form.message}</p>`

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.laposte.net',
    port: 587,
    secure: false,
    auth: {
      user: 'gweltaz.dev@laposte.net',
      pass: 'TRbkxWTka$5wS!B!c7W8e!wF',
    },
  });

  // send mail with defined transport object
  let mailOption = {
    from: '"Envame contact form" <gweltaz.dev@laposte.net>',
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