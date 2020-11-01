// Responsiv Navbar
const responsivNavbar = () =>{
  const burgerBtn = document.querySelector('.hamburger-btn')
  const navBar = document.querySelector('.navbar__menu')
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
      if(!e.target.classList.contains('modal__title') && !e.target.classList.contains('modal__text') &&  !e.target.classList.contains('modal__text--highlight') && !e.target.classList.contains('modal')){
        modalBg.classList.remove('modal__bg--active')
        modal.classList.remove('modal--active')    
      }
  })

}

// Invoc global function
const app = ()=>{
  responsivNavbar();
  buyModal();
}

app()

