// Responsiv Navbar
const responsivNavbar = () =>{
  const burgerBtn = document.querySelector('.hamburger-btn')
  const navBar = document.querySelector('.navbar__menu')
  const header = document.querySelector('.navbar')
  const headerLogo = document.querySelector('.navbar__logo')
  const navLink = document.querySelectorAll('.navbar__links')

  // burgerBtn opening Navbar
  burgerBtn.addEventListener('click', () => {
    // burgerBtn animation
    burgerBtn.classList.toggle('burgerNavOpen')

    // navBar toggle
    navBar.classList.toggle('burgerNavOpen')
  })

    // navLink closing Navbar
  navLink.forEach((link) => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('burgerNavOpen')
      navBar.classList.remove('burgerNavOpen')
    })
  })

  // scroll closing Navbar
  window.addEventListener('scroll', () => {
    burgerBtn.classList.remove('burgerNavOpen')
    navBar.classList.remove('burgerNavOpen')
  })
}

//landing-page effect
const landingPageEffect = () => {
  landingPage = document.querySelector('.landing-page')
  nextcontent = document.querySelector('.container')

  // push effect
  window.addEventListener('scroll', (e) => {
    if(window.scrollY > 0 && !landingPage.classList.contains('landing-page-push-effect')){
      landingPage.classList.add('landing-page-push-effect')
      nextcontent.classList.add('next-content-pull-effect')
    }
  })

  // pull with scroll effect
  window.addEventListener('scroll', () => {
    if(landingPage.classList.contains('landing-page-push-effect') && window.scrollY == 0){
      landingPage.classList.remove('landing-page-push-effect')
      nextcontent.classList.remove('next-content-pull-effect')
    }
  })
}


//buying Btn  modal pop up 
const buyModal = () => {
  const modalNavBtn = document.querySelector('.buyNavModal')
  const modalBtn = document.querySelectorAll('.buyModal')
  const modalCloseBtn = document.querySelectorAll('.modal__close')
  const modalBg = document.querySelector('.modal__bg')
  const modal = document.querySelector('.modal')

  // toggle modal with NavBtn
  modalNavBtn.addEventListener('click', () =>{
    modalBg.classList.toggle('modal__bg--active')
    modal.classList.toggle('modal--active')
  })

  // open modal with other Btn
  modalBtn.forEach((btn) => {
    btn.addEventListener('click', () =>{
      modalBg.classList.add('modal__bg--active')
      modal.classList.add('modal--active')
    })
  })

  // close modal with btn
  modalCloseBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
    modalBg.classList.remove('modal__bg--active')
    modal.classList.remove('modal--active')

    })
  })

  // close modal by clicking outside
  modalBg.addEventListener('click', (e) => {
    console.log(e.target)
      if(!e.target.classList.contains('modal__title') && !e.target.classList.contains('modal__text') &&  !e.target.classList.contains('modal__text--highlight') && !e.target.classList.contains('modal')){
        modalBg.classList.remove('modal__bg--active')
        modal.classList.remove('modal--active')    
      }
  })

}

// Newsletter modal
const newsletterModal = () => {
  const newsletter = document.querySelector('.modal-newsletter')
  if(newsletter){
    const modalCloseBtn = document.querySelector('.modal-newsletter__close')
    const modalBg = document.querySelector('.modal-newsletter__bg')
    const modal = document.querySelector('.modal-newsletter__bg')
  
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.add('modal-newsletter__bg--hidden')
      })

    modalBg.addEventListener('click', () => {
      modal.classList.add('modal-newsletter__bg--hidden')
      })  
  }
}

// Invoc global function
const app = ()=>{
  responsivNavbar();
  landingPageEffect();
  buyModal();
  newsletterModal();
}

app()