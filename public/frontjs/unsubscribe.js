// unsubscribe newsletter
const newsletterUnsubscribe = () => {
  const unsubscribeForm = document.querySelector('.unsubscribe__form');
  const unsubscribeModal = document.querySelector('.unsubscribe-modal')
  const unsubscribeMail = document.querySelector('.unsubscribe__email--input');

  unsubscribeMail.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(unsubscribeMail.value.trim()): //removing all class if empty
        const parentElementUserEmail = unsubscribeMail.parentElement
        const errorTextUserEmail = parentElementUserEmail.querySelector('.newsletter__checkmessage')
        if(parentElementUserEmail.classList.contains('newsletter--success')){
          parentElementUserEmail.classList.remove('newsletter--success')
        }
        if(parentElementUserEmail.classList.contains('newsletter--failed')){
          parentElementUserEmail.classList.remove('newsletter--failed')
        }
        errorTextUserEmail.textContent = ''
        break

      case /^[\w-\.À-ÿ]{2,40}@[\wÀ-ÿ]{2,25}\.[a-zA-Z]{2,4}$/i.test(unsubscribeMail.value.trim()):
        setSuccessFor(unsubscribeMail);
        break

      default:
        setErrorFor(unsubscribeMail, 'Veuillez renseigner une adresse email valide')
    }
  })
  
  // error handling
  const setErrorFor = (input, message) => {
    const parentElement = input.parentElement
    const errorText = parentElement.querySelector('.newsletter__checkmessage')

    // removing success class if present
    if(parentElement.classList.contains('newsletter--success')){
      parentElement.classList.remove('newsletter--success')
    }
    // adding failed class and failed message
    parentElement.classList.add('newsletter--failed')
    errorText.textContent = message
  }

  // success handling
  const setSuccessFor = (input) => {
    const parentElement = input.parentElement

    // removing success class if present
    if(parentElement.classList.contains('newsletter--failed')){
      parentElement.classList.remove('newsletter--failed')
    }
    // adding failed class and failed message
    parentElement.classList.add('newsletter--success')
  }

  unsubscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userEmail = unsubscribeMail.value

    const options = {
      method : 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({userEmail})
    }

    try{
      const response = await fetch('/newsletter_unsubscribe', options)
      const data = await response.json()

      switch(data.status){
        case "success":
          unsubscribeModal.textContent = `Vous êtes bien désabonné`
          setTimeout(() => {unsubscribeModal.classList.add('unsubscribe-modal--success')}, 0);
          setTimeout(() => {unsubscribeModal.classList.remove('unsubscribe-modal--success')}, 3000);
          break
        case "failed":
          unsubscribeModal.textContent = `Votre e-mail n'est pas abonné a notre newsletter`
          setTimeout(() => {unsubscribeModal.classList.add('unsubscribe-modal--failed')}, 0);
          setTimeout(() => {unsubscribeModal.classList.remove('unsubscribe-modal--failed')}, 3000);
          break
        case "error":
          unsubscribeModal.textContent = `Une erreur technique est survenue, veuillez réessayer plus tard`
          setTimeout(() => {unsubscribeModal.classList.add('unsubscribe-modal--failed')}, 0);
          setTimeout(() => {unsubscribeModal.classList.remove('unsubscribe-modal--failed')}, 3000);
          break
        case "badInput":
          unsubscribeModal.textContent = `Veuillez renseigner une adresse email valide`
          setTimeout(() => {unsubscribeModal.classList.add('unsubscribe-modal--failed')}, 0);
          setTimeout(() => {unsubscribeModal.classList.remove('unsubscribe-modal--failed')}, 3000);
          break
      }
    } catch (err){
      console.log(err);
    }
  })
}

newsletterUnsubscribe();
