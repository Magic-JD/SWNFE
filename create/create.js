const endpoints = [
  { endpoint: "stat-block", display: "stat-block-display", tooltip: false },
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
      let properties = JSON.parse(text).properties;
      details = ""
      properties.forEach(p => details += p.name + ": " + p.details + '<br>');
      display.innerHTML = details
      if (element.tooltip) {
        const tippyInstance = tippy(display, {
          arrow: false,
          placement: 'left',
          animation: 'scale',
          interactive: true,
          delay: [0, 100]
        })
        getTooltip(tippyInstance, element.endpoint + "/" + properties[0].details.split(" ")[0].toLowerCase().replace(/\W/g, ""))
      }
      //document.getElementById("barbarian-button").style.display = "block";

      currentEndpoint++;
      if (currentEndpoint >= endpoints.length) {
        document.getElementById("primary-button").style.display = "none";
        //document.getElementById("barbarian-button").style.display = "none";
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
        tippyInstance.setContent(text.replace(/\n/g, '<br>').replace("'", "&#39;"))
        return text
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
}

function barbarianClick(event) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/origin/barbarian`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      document.getElementById("primary-button").style.display = "none";
      document.getElementById("barbarian-button").style.display = "none";
      const display = document.getElementById("origin-display");
      getTooltip(createTippyInstance(display), "origin/barbarian")
      let properties = JSON.parse(text).properties;
      details = ""
      properties.forEach(p => details += p.name + ": " + p.details + '<br>');
      display.innerHTML = details
      currentEndpoint++;
      return text
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })


}

function createTippyInstance(display) {
  return tippy(display, {
    arrow: false,
    placement: 'left',
    animation: 'scale',
    interactive: true,
    delay: [0, 100]
  })
}

document.getElementById("primary-button").addEventListener('click', handleStatBlockClick);
//document.getElementById("barbarian-button").style.display = "none"
//document.getElementById("barbarian-button").addEventListener('click', barbarianClick);