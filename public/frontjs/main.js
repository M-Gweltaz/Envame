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

// Invoc global function
const app = ()=>{
  responsivNavbar();
}

app()

