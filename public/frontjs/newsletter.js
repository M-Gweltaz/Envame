// Newsletter form handler
const newsletterFormHandler =  () => {
  const newsletterForm = document.querySelector('.newsletter')
  const userEmail = document.querySelector('.newsletter__email--input')

  // sending email as JSON with fetch
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const newsletterEmail = userEmail.value
    
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
      console.log(err)
      serverErr = {status : "serverIssues"}
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
  console.log(data)
  switch(data.status){
    case "success" :
      modalTitle.textContent = 'Inscription réussi'
      modalText.innerHTML = `Félicitation, grâce a votre inscription, vous serez informé de toutes nos nouveautés en avant-première !<br>Vous recevrez votre code cadeau à préciser lors de votre première commande directement sur votre Email : <span class="modal-newsletter__text--highlight">${data.userEmail}</span>`
      break;

    case "invalidEmail" :
      modalTitle.textContent = 'Oups, e-mail invalide'
      modalText.textContent = 'Veuillez renseigner une adresse e-mail valide pour être informé de tous nos bons plans et pour pouvoir bénéficier de votre code cadeau.'
      break;

    case "serverIssues" : 
      modalTitle.textContent = 'Oups, notre serveur est en maintenance'
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

newsletterFormHandler();
