const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', (req, res) => {
  res.render('check-out', {currentPrice: req.currentPrice})
})

router.get('/checkout-session', async (req, res) => {
  const { id } = req.query;
  const session = await stripe.checkout.sessions.retrieve(id);
  res.send(session);
})

router.post('/create-checkout-session', async (req, res) => {
  const params = req.body

  // data validation
  if (!/^[0-9]{1,2}$/.test(params.currentQuantity)) {
    return res.status(400).json({ error: 'Veuillez renseinger une quantité valide de 1 à 10' });
  }
  if (!params.selectedCountry == 'france' || !params.selectedCountry == 'europe' || !params.selectedCountry == 'international') {
    return res.status(400).json({ error: 'Veuillez renseinger une zone de livraison valide' });
  }

  let shippingCountries
  let shippingFees

  switch (params.selectedCountry) {
    case 'france':
      shippingCountries = ["FR"]
      shippingFees = process.env.STRIPE_FR_SHIPPING_PRICE
      break
      
    case 'europe':
      shippingCountries = [// -----[ EU 28 ]-----
    "AT", // Austria
    "BE", // Belgium
    "BG", // Bulgaria
    "HR", // Croatia
    "CY", // Cyprus
    "CZ", // Czech Republic
    "DK", // Denmark
    "EE", // Estonia
    "FI", // Finland
    "DE", // Germany
    "GR", // Greece
    "HU", // Hungary
    "IE", // Ireland, Republic of (EIRE)
    "IT", // Italy
    "LV", // Latvia
    "LT", // Lithuania
    "LU", // Luxembourg
    "MT", // Malta
    "NL", // Netherlands
    "PL", // Poland
    "PT", // Portugal
    "RO", // Romania
    "SK", // Slovakia
    "SI", // Slovenia
    "ES", // Spain
    "SE", // Sweden
    "GB", // United Kingdom (Great Britain)

    // -----[ Outermost Regions (OMR) ]------
    "GF", // French Guiana
    "GP", // Guadeloupe
    "MQ", // Martinique
    "ME", // Montenegro
    "YT", // Mayotte
    "RE", // Réunion
    "MF", // Saint Martin

    // -----[ Special Cases: Part of EU ]-----
    "GI", // Gibraltar
    "AX", // Åland Islands

    // -----[ Overseas Countries and Territories (OCT) ]-----
    "PM", // Saint Pierre and Miquelon
    "GL", // Greenland
    "BL", // Saint Bartelemey
    "SX", // Sint Maarten
    "AW", // Aruba
    "CW", // Curacao
    "WF", // Wallis and Futuna
    "PF", // French Polynesia
    "NC", // New Caledonia
    "TF", // French Southern Territories
    "AI", // Anguilla
    "BM", // Bermuda
    "IO", // British Indian Ocean Territory
    "VG", // Virgin Islands, British
    "KY", // Cayman Islands
    "FK", // Falkland Islands (Malvinas)
    "MS", // Montserrat
    "PN", // Pitcairn
    "SH", // Saint Helena
    "GS", // South Georgia and the South Sandwich Islands
    "TC", // Turks and Caicos Islands

    // -----[ Microstates ]-----
    "AD", // Andorra
    "LI", // Liechtenstein
    "MC", // Monaco
    "SM", // San Marino
    "VA", // Vatican City

    // -----[ Other ]-----
    "JE", // Jersey
    "GG", // Guernsey
      ];
      shippingFees = process.env.STRIPE_EU_SHIPPING_PRICE
    break

    case 'international': 
    shippingCountries = ["AC", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AU", "AZ", "BA", "BB", "BD", "BF", "BH", "BI", "BJ", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "DJ", "DM", "DO", "DZ", "EC", "EG", "EH", "ER", "ET", "FJ", "FO", "GA", "GD", "GE", "GH", "GM", "GN", "GQ", "GT", "GU", "GW", "GY", "HK", "HN", "HT", "ID", "IL", "IM", "IN", "IQ", "IS", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KZ", "LA", "LB", "LC", "LK", "LR", "LS", "LY", "MA", "MD", "MG", "MK", "ML", "MM", "MN", "MO", "MR", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PN", "PR", "PS", "PY", "QA", "RS", "RU", "RW", "SA", "SB", "SC", "SG", "SJ", "SL", "SN", "SO", "SR", "SS", "ST", "SV", "SZ", "TA", "TD", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "VN", "VU", "WS", "XK", "YE", "ZA", "ZM", "ZW", "ZZ"]
    shippingFees = process.env.STRIPE_WOLRD_SHIPPING_PRICE
    break
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: shippingCountries,
    },
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_KEY,
        quantity: params.currentQuantity,
      },
      {
        price: shippingFees,
        quantity: 1,
      },
    ],
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `https://envame.com/check-out/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://envame.com/`,
  });
  res.json({ id: session.id });
})

router.post('/webhook', (req, res) => {
  let event = req.body

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      let buyingDate = new Date()
      
      // mail input
      const output = `<h1>✨ Vous avez reçu une nouvelle commande réalisé via Envame.com ✨</h1>
      <h3>Retrouvez tout le détail directement sur votre compte Stripe</h3>
      <h2>Commande passé le : ${buyingDate.getDate()} / ${buyingDate.getMonth() + 1} / ${buyingDate.getFullYear()}`

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
        subject: 'Nouvelle commande',
        text: 'Hello world?', 
        html: output, 
      };

      // sending welcome newsletter email
      transporter.sendMail(mailOption);
      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
});

// payement success
router.get('/success', (req, res) => {
  res.render('success')
})

module.exports = router
