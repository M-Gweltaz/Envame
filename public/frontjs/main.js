// Responsiv Navbar
const responsivNavbar = () =>{
  const burgerBtn = document.querySelector('.hamburger-btn');
  const navBar = document.querySelector('.navbar__menu');

  burgerBtn.addEventListener('click',() =>{
    // burgerBtn animation
    burgerBtn.classList.toggle('burgerNavOpen');

    // navBar toggle
    navBar.classList.toggle('burgerNavOpen');
  });
}


// Invoc global function
const app = ()=>{
  responsivNavbar();
}

app()