// Contact form handler
const contactFormHandler = () => {
  const contactForm = document.querySelector('.contact__form')
  const contactFirstName = document.querySelector('.contact__first-name--input')
  const contactLastName = document.querySelector('.contact__last-name--input')
  const contactEmail = document.querySelector('.contact__email--input')
  const contactPhone = document.querySelector('.contact__phone--input')
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
  contactPhone.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(contactPhone.value.trim()):  //removing all class if empty
        const parentElementPhone = contactPhone.parentElement
        const errorTextPhone = parentElementPhone.querySelector('.contact__checkmessage')
        if(parentElementPhone.classList.contains('contact--success')){
          parentElementPhone.classList.remove('contact--success')
        }
        if(parentElementPhone.classList.contains('contact--failed')){
          parentElementPhone.classList.remove('contact--failed')
        }
        errorTextPhone.textContent = ''
        break

      case contactPhone.value.trim().length>15:
        setErrorFor(contactPhone, 'Votre numéro est trop long')
          break

      case /([^0-9 +.()-])/g.test(contactPhone.value.trim()):
        setErrorFor(contactPhone, 'Veuillez renseigner un numéro valide')
        break

      case /^([0-9 +.()-]{0,15})$/.test(contactPhone.value.trim()):
        setSuccessFor(contactPhone);
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

      case /([^-,A-Za-zÀ-ÿ. '!€:@])+/.test(contactMessage.value.trim()):
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

    // data to be send as Json
    const firstName = contactFirstName.value
    const lastName = contactLastName.value
    const email = contactEmail.value
    const phone = contactPhone.value
    const message = contactMessage.value

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
          body : JSON.stringify({ firstName, lastName, email, phone, message })
        }

        // Sending fetch request
        try{
          const response = await fetch('/contact/form', options)
          const data = await response.json()
          contactModal(data)
        } catch (err) {
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

    case "badInput":
      modal.textContent = 'Un champ du formulaire est invalide, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--success')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--success')}, 3000);
      break;

    case "serverIssues":
      modal.innerHTML ='Une erreur est survenue, veuillez réessayer'
      setTimeout(() => {modal.classList.add('contact-form-modal--failed')}, 0);
      setTimeout(() => {modal.classList.remove('contact-form-modal--failed')}, 3000);
      break;
  }
}

contactFormHandler()