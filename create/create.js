function handleStatBlockClick(event) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/stat-block`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      document.getElementById('stat-block-display').innerHTML = text.replace(/\n/g, '<br>').replace("'", "&#39;")
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

document.getElementById("stat-block-button").addEventListener('click', handleStatBlockClick)
