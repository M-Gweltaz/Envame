// Contact form handler
const contactFormHandler = () => {
  const contactForm = document.querySelector('.contact__form')
  const contactFirstName = document.querySelector('.contact__first-name--input')
  const contactLastName = document.querySelector('.contact__last-name--input')
  const contactEmail = document.querySelector('.contact__email--input')
  const contactSmartphone = document.querySelector('.contact__phone--input')
  const contactMessage = document.querySelector('.contact__message--input')
  const modal = document.querySelector('.contact-form-modal')

  // data validation on input
  contactFirstName.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactFirstName.value.trim()):
        setErrorFor(contactFirstName, 'Veuillez remplir votre prénom')
        break

      case contactFirstName.value.trim().length<2:
        setErrorFor(contactFirstName, 'Votre prénom est trop court')
        break

      case contactFirstName.value.trim().length>30 :
        setErrorFor(contactFirstName, 'Votre prénom est trop long')
        break

      case /([^-,A-Za-zÀ-ÿ. '])+/.test(contactFirstName.value.trim()):
        setErrorFor(contactFirstName, `N'utilisez pas de caractères spéciaux`)
        break

      default:
        setSuccessFor(contactFirstName);
    }
  })

  // data validation on input
  contactLastName.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactLastName.value.trim()):
        setErrorFor(contactLastName, 'Veuillez remplir votre nom')
        break

      case contactLastName.value.trim().length<2:
        setErrorFor(contactLastName, 'Votre nom est trop court')
        break

      case contactLastName.value.trim().length>30 :
        setErrorFor(contactLastName, 'Votre nom est trop long')
        break

      case /([^-,A-Za-zÀ-ÿ. '])+/.test(contactLastName.value.trim()):
        setErrorFor(contactLastName, `N'utilisez pas de caractères spéciaux`)
        break

      default:
        setSuccessFor(contactLastName);
    }
  })
  
  // data validation on input
  contactEmail.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactEmail.value.trim()):
        setErrorFor(contactEmail, 'Adresse e-mail obligatoire')
        break

      case /^[\w-\.À-ÿ]{2,40}@[\wÀ-ÿ]{2,25}\.[a-zA-Z]{2,4}$/i.test(contactEmail.value.trim()):
        setSuccessFor(contactEmail);
        break

      default:
      setErrorFor(contactEmail, 'Veuillez renseigner une adresse email valide')
    }
  })

  // data validation on input
  contactSmartphone.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactSmartphone.value.trim()):  //removing all class if empty
        const parentElementSmartphone = contactSmartphone.parentElement
        const errorTextSmartphone = parentElementSmartphone.querySelector('.contact__checkmessage')
        if(parentElementSmartphone.classList.contains('contact--success')){
          parentElementSmartphone.classList.remove('contact--success')
        }
        if(parentElementSmartphone.classList.contains('contact--failed')){
          parentElementSmartphone.classList.remove('contact--failed')
        }
        errorTextSmartphone.textContent = ''
        break

      case contactSmartphone.value.trim().length>15:
        setErrorFor(contactSmartphone, 'Votre numéro est trop long')
          break

      case /([^0-9 +.()-])/g.test(contactSmartphone.value.trim()):
        setErrorFor(contactSmartphone, 'Veuillez renseigner un numéro valide')
        break

      case /^([0-9 +.()-]{0,15})$/.test(contactSmartphone.value.trim()):
        setSuccessFor(contactSmartphone);
        break
    }
  })
  
  // data validation on input
  contactMessage.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactMessage.value.trim()):
        setErrorFor(contactMessage, 'Écrivez votre message')
        break
      
      case contactMessage.value.trim().length>500:
        setErrorFor(contactMessage, `Votre message est trop long`)
        break

      case /([^-,A-Za-zÀ-ÿ. '!€:])+/.test(contactMessage.value.trim()):
        setErrorFor(contactMessage, `N'utiliser pas des caractères spéciaux`)
        break

      default:
        setSuccessFor(contactMessage);
    }
  })

  // error handling
  const setErrorFor = (input, message) => {
      const parentElement = input.parentElement
      const errorText = parentElement.querySelector('.contact__checkmessage')

      // removing success class if present
      if(parentElement.classList.contains('contact--success')){
        parentElement.classList.remove('contact--success')
      }
      // adding failed class and failed message
      parentElement.classList.add('contact--failed')
      errorText.textContent = message
  }

  // success handling
  const setSuccessFor = (input) => {
    const parentElement = input.parentElement

    // removing success class if present
    if(parentElement.classList.contains('contact--failed')){
      parentElement.classList.remove('contact--failed')
    }
    // adding failed class and failed message
    parentElement.classList.add('contact--success')
  }

  // sending email as JSON with fetch
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // data
    const form = {
      firstName: contactFirstName.value,
      lastName: contactLastName.value,
      email: contactEmail.value,
      smartphone: contactSmartphone.value,
      message: contactMessage.value
    }

    // data validation before submit
    switch(true) {
      case contactMessage.parentElement.classList.contains('contact--failed'):
        modal.innerHTML ='Champ message invalide'
        setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
        setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
        break
      
      default:
        // fetch options 
        const options = {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({form})
        }

        // Sending fetch request
        try{
          const response = await fetch('/contact/form', options)
          const data = await response.json()
          console.log(data)
          contactModal(data)
        } catch (err) {
          console.log(err)
          serverErr = {status : "serverIssues"}
          contactModal(serverErr)
        }
    }
  })
}

const contactModal = (data) => {
  const modal = document.querySelector('.contact-form-modal')

  switch(data.status){
    case "success":
      modal.textContent = 'Message envoyé !'
      setTimeout(() => {modal.classList.add('contact-form-modal--success')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--success')}, 3000);
      break;

    case "invalidFirstnameInput":
      modal.innerHTML ='Champ prénom invalide, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;

    case "invalidLastnameInput":
      modal.innerHTML ='Champ nom invalide, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;

    case "invalidEmailInput":
      modal.innerHTML =`Champ e-mail invalide, veuillez réessayer`
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;

    case "invalidPhoneInput":
      modal.innerHTML ='Champ téléphone invalide, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;

    case "invalidMessageInput":
      modal.innerHTML ='Champ message invalide, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;

    case "serverIssues":
      modal.innerHTML ='Une erreur est survenue, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;
  }
}

contactFormHandler()