const endpoints = [
  { endpoint: "stat-block", display: "stat-block-display" },
  { endpoint: "origin", display: "origin-display" }
];

let currentEndpoint = 0;

function handleStatBlockClick(event) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/${endpoints[currentEndpoint].endpoint}`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      document.getElementById(endpoints[currentEndpoint].display).innerHTML = text.replace(/\n/g, '<br>').replace("'", "&#39;")
      currentEndpoint++;
      if (currentEndpoint >= endpoints.length) {
          document.getElementById("primary-button").style.display = "none";
          const parentDiv = document.getElementById("primary-button").parentNode;
          parentDiv.parentNode.removeChild(parentDiv);
      } else {
        document.getElementById("primary-button").innerHTML = `Create ${endpoints[currentEndpoint].endpoint.replace("-", " ")}`;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

document.getElementById("primary-button").addEventListener('click', handleStatBlockClick)