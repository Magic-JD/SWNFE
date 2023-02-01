function handleButtonClick(event) {
  let endpoint = ''
  switch (event.target.id) {
    case 'beast-button':
      endpoint = 'beast'
      break
    case 'standard-npc-button':
       endpoint = 'npc/standard'
       break
    case 'patron-button':
      endpoint = 'npc/patron'
      break
    case 'world-button':
      endpoint = 'world'
      break
    case 'wild-encounter-button':
      endpoint = 'encounter/wilderness'
      break
    case 'urban-encounter-button':
      endpoint = 'encounter/urban'
      break
    case 'problem-button':
      endpoint = 'problem'
      break
  }

  fetch(`https://swn-generate.herokuapp.com/generate/${endpoint}`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      document.getElementById('display').innerHTML = text.replace(/\n/g, '<br>').replace("'", "&#39;")
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function handleRedirect(event){
  window.location.replace("../create/pc.html");
}

document.querySelectorAll('button').forEach(button => {
  if(button.id == "pc-button"){
    button.addEventListener('click', handleRedirect)
  } else {
    button.addEventListener('click', handleButtonClick)
  }

})