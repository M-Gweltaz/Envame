// Newsletter form handler
const newsletterFormHandler =  () => {
  const newsletterForm = document.querySelector('.newsletter')
  const userEmail = document.querySelector('.newsletter__email--input')

  userEmail.addEventListener('change', (e) => {
    switch(true) {
      case /^$/.test(userEmail.value.trim()): //removing all class if empty
        const parentElementUserEmail = userEmail.parentElement
        const errorTextUserEmail = parentElementUserEmail.querySelector('.newsletter__checkmessage')
        if(parentElementUserEmail.classList.contains('newsletter--success')){
          parentElementUserEmail.classList.remove('newsletter--success')
        }
        if(parentElementUserEmail.classList.contains('newsletter--failed')){
          parentElementUserEmail.classList.remove('newsletter--failed')
        }
        errorTextUserEmail.textContent = ''
        break

      case /^[\w-\.À-ÿ]{2,40}@[\wÀ-ÿ]{2,25}\.[a-zA-Z]{2,4}$/i.test(userEmail.value.trim()):
        setSuccessFor(userEmail);
        break

      default:
      setErrorFor(userEmail, 'Veuillez renseigner une adresse email valide')
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

  // sending email as JSON with fetch
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // data
    const newsletterEmail = userEmail.value
    
    // fetch options
    const options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({newsletterEmail})
    }

    try{
      const response = await fetch('/newsletter', options)
      const data = await response.json()
      newsletterModal(data)
    } catch (err){
      const serverErr = {status : "error"}
      newsletterModal(serverErr)
    }
  })
}

// newsletter modal  pop up
const newsletterModal = (data) => {
  const modal = document.querySelector('.modal-newsletter')
  const modalBg = document.querySelector('.modal-newsletter__bg')
  const modalCloseBtn = document.querySelector('.modal-newsletter__close')
  const modalTitle = document.querySelector('.modal-newsletter__title')
  const modalText = document.querySelector('.modal-newsletter__text')

  // Sorting fetch responses with correct modal text
  switch(data.status){
    case "success" :
      modalTitle.textContent = 'Inscription réussi'
      modalText.innerHTML = `Félicitation, grâce a votre inscription, vous serez informé de toutes nos nouveautés et promotions en avant-première !<br>Vous recevrez votre code cadeau à préciser lors de votre première commande directement sur votre Email : <span class="modal-newsletter__text--highlight">${data.userEmail}</span>`
      break;

    case "failed" :
      modalTitle.textContent = 'Déjà inscrit'
      modalText.innerHTML = `Vous êtes déjà inscrit à notre newsletter avec cette adresse e-mail ! Nous vous informerons de toutes nos nouveautés et promotions en avant-première`
      break;

    case "badInput" :
      modalTitle.textContent = 'Adresse e-mail invalide'
      modalText.textContent = 'Veuillez renseigner une adresse e-mail valide pour être informé de tous nos bons plans et pour pouvoir bénéficier de votre code cadeau.'
      break;

    case "error" : 
      modalTitle.textContent = 'Serveur en maintenance'
      modalText.textContent = 'Pour des raisons techniques, notre serveur est actuellement en maintenance. Nous tenons à nous excuser pour la gêne occasionnée. Nous faisons tout notre possible pour rétablir cette fonctionnalité au plus vite.'
      break;
  }

  // modal poping
  modal.classList.add('modal-newsletter--active')
  modalBg.classList.add('modal-newsletter__bg--active')

  // modal closing Btn
  modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('modal-newsletter--active')
    modalBg.classList.remove('modal-newsletter__bg--active')
    })

    // modal closing by clicking outside
  modalBg.addEventListener('click', (e) => {
    if(!e.target.classList.contains('modal-newsletter__title') && !e.target.classList.contains('modal-newsletter__text') && !e.target.classList.contains('modal-newsletter__text--highlight') && !e.target.classList.contains('modal-newsletter')){
      modal.classList.remove('modal-newsletter--active')
      modalBg.classList.remove('modal-newsletter__bg--active')
    }
  })  
}

newsletterFormHandler()
