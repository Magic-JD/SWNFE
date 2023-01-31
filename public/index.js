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
  }

  fetch(`http://localhost:8080/generate/${endpoint}`, { method: 'GET' })
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

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', handleButtonClick)
})
