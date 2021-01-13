const express = require('express');
const { set } = require('mongoose');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const product = {
  price: 179,
  quantity: 1,
  total: this.price * this.quantity
}

router.get('/', (req, res) => {
  res.render('check-out', {product: product})
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
    success_url: `http://localhost:5000/check-out/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://envame.com/`,
  });
  res.json({ id: session.id });
})

// payement success
router.get('/success', (req, res) => {
  res.render('success')
})

module.exports = router
