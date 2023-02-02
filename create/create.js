const endpoints = [
  { endpoint: "stat-block", display: "stat-block-display", tooltip: false},
  { endpoint: "origin", display: "origin-display", tooltip: true }
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
      const element = endpoints[currentEndpoint];
      const display = document.getElementById(element.display);
      display.innerHTML += text.replace(/\n/g, '<br>').replace("'", "&#39;");
      if(element.tooltip){
        const tippyInstance = tippy(display, {
          arrow: true,
          theme: "dark",
          delay: [0, 100]
        })
        getTooltip(tippyInstance, element.endpoint)
      }

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

function getTooltip(tippyInstance, url){
    fetch(`https://swn-generate.herokuapp.com/create/pc/tooltip/${url}`, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.text()
      })
      .then(text => {
        tippyInstance.setContent(text)
        return text
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
}

document.getElementById("primary-button").addEventListener('click', handleStatBlockClick);
