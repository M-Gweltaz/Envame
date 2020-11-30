// unsubscribe newsletter
const newsletterUnsubscribe = () => {
  const unsubscribeForm = document.querySelector('.unsubscribe__form');
  const unsubscribeStatus = document.querySelector('.unsubscribe__status');
  const unsubscribeMail = document.querySelector('.unsubscribe__email--input');

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
          unsubscribeStatus.innerHTML = `<p class="unsubscribe--success">Vous êtes bien désabonné</p>`
          break
        case "failed":
          unsubscribeStatus.innerHTML = `<p class="unsubscribe--failed">Votre e-mail n'est pas abonné a notre newsletter</p>`
          break
        case "error":
          unsubscribeStatus.innerHTML = `<p class="unsubscribe--failed">Une erreur technique est survenue, veuillez réessayer plus tard</p>`
          break
        case "badInput":
          unsubscribeStatus.innerHTML = `<p class="unsubscribe--failed">Veuillez remplir un e-mail valide</p>`
          break
      }
    } catch (err){
      console.log(err);
    }
  })
}

newsletterUnsubscribe();
