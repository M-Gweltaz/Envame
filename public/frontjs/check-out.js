
// Setting the total amount based on quantity and price
const totalAmount = () => {
  const productPrice = document.querySelector('.check-out__price--amount');
  const productQuantity = document.querySelector('.check-out__params--quantity');
  const shippingChoice = document.querySelector('.check-out__params--country')
  const productTotal = document.querySelector('.check-out__total--amount');
  let shippingFee = 9.99

  shippingChoice.addEventListener('change', () => {
    const selectedValue = shippingChoice.options[shippingChoice.selectedIndex].value;
    
    switch(selectedValue) {
      case 'france':
        shippingFee = 9.99
        break

      case 'europe':
        shippingFee = 15.99
        break
      
      case 'international':
        shippingFee = 30
        break
    }

    const currentQuantity = parseInt(productQuantity.value)
    const currentPrice = parseInt(productPrice.innerHTML)
    const currentTotal = currentQuantity * currentPrice + shippingFee
    productTotal.textContent = `${currentTotal} €`
  })

  productQuantity.addEventListener('change', () => {
    const currentQuantity = parseInt(productQuantity.value)
    const currentPrice = parseInt(productPrice.innerHTML)
    const currentTotal = currentQuantity * currentPrice + shippingFee
    productTotal.textContent = `${currentTotal} €`
  })
}
totalAmount()


// stipe checkout paiement handler
// Create an instance of the Stripe object with your publishable API key
var stripe = Stripe("pk_test_51I0V6wC6umyWGK6v5Tj5qus5pFPlCt7YPoNR0kNJEGVUPrJM9UYcqiZRhWpOaLkSj9N98zivYZVk4nsUST0KaVHY00LmtddoTJ");
var checkoutButton = document.getElementById("checkout-button");
checkoutButton.addEventListener("click", function () {
  // checking quatity value
  const productQuantity = document.querySelector('.check-out__params--quantity')
  const currentQuantity = parseInt(productQuantity.value)
  // checking shipping fees
  const shippingChoice = document.querySelector('.check-out__params--country')
  const selectedCountry = shippingChoice.options[shippingChoice.selectedIndex].value;
  

  // sending post request 
  fetch("/check-out/create-checkout-session", {
    method: "POST",
    headers: {
          'Content-Type': 'application/json'
        },
    body : JSON.stringify({ currentQuantity, selectedCountry })

  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
});