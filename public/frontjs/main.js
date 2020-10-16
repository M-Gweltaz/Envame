// Responsiv Navbar
const responsivNavbar = () =>{
  const burgerBtn = document.querySelector('.hamburger-btn');
  const navBar = document.querySelector('.navbar__menu');

  burgerBtn.addEventListener('click', () =>{
    // burgerBtn animation
    burgerBtn.classList.toggle('burgerNavOpen');

    // navBar toggle
    navBar.classList.toggle('burgerNavOpen');
  });
}

//buying Btn  modal pop up 
const buyModal = () => {
  const modalNavBtn = document.querySelector('.buyNavModal');
  const modalBtn = document.querySelectorAll('.buyModal');
  const modalCloseBtn = document.querySelectorAll('.modal__close');
  const modal = document.querySelector('.modal__bg');

  modalNavBtn.addEventListener('click', () =>{
    modal.classList.toggle('modal__bg--active');
  });

  modalBtn.forEach((btn) => {
    btn.addEventListener('click', () =>{
      modal.classList.add('modal__bg--active');
    });
  });

  modalCloseBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
    modal.classList.remove('modal__bg--active');
    });
  });
}

// Newsletter modal
const newsletterModal = () => {
  const newsletter = document.querySelector('.modal-newsletter');
  if(newsletter){
    const modalCloseBtn = document.querySelector('.modal-newsletter__close');
    const modal = document.querySelector('.modal-newsletter__bg');
  
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.add('modal-newsletter__bg--hidden');
      });
  }
}

// Invoc global function
const app = ()=>{
  responsivNavbar();
  buyModal();
  newsletterModal();
}

app()