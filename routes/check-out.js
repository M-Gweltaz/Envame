const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = 'http://localhost:5000';

router.get('/', (req, res) => {
  res.render('check-out')
})

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Envame SPA2.0',
            images: ['./assets/pictures/spa2.jpeg'],
          },
          unit_amount: 17900,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/check-out/success`,
    cancel_url: `${YOUR_DOMAIN}/check-out/cancel`,
  });
  res.json({ id: session.id });
})

// payement success
router.get('/success', (req, res) => {
  res.render('success')
})

// payement cancel
router.get('/cancel', (req, res) => {
  res.render('cancel')
})

module.exports = router
