// Getting session id in url params
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Fetching the session data
if (id) {
  fetch('/check-out/checkout-session?id=' + id)
    .then(function (result) {
      return result.json();
    })
    .then(function (session) {
      // formating the total amount
      const totalAmount = JSON.stringify(session.amount_total) /100 + ' €'

      // Calculing the shipping delais
      let shippingDuration
      switch(session.shipping_address_collection.allowed_countries.length) {
        case 1: 
          shippingDuration = '48 heures'
          break

        case 64:
          shippingDuration = '5 à 7 jours'
          break

        case 167:
          shippingDuration = '7 jours'
          break

        default: shippingDuration = '7 jours'
      }

      // Adding session data in the success page
      document.querySelector('#check-out-command').textContent = session.id
      document.querySelector('#check-out-amount').textContent = totalAmount
      document.querySelector('#check-out-shipping').textContent = shippingDuration
    })
    .catch(function (err) {
      console.log('Error when fetching Checkout session', err);
    });
}
