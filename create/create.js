function handleGenerateClick(event) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/${event.target.id}`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      display = event.target.parentNode
      let properties = JSON.parse(text).properties;
      details = ""
      properties.forEach(p => details += p.name + ": " + p.details + '<br>');
      display.innerHTML = details
      handleDisplay(display)
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function presetClick(event) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/origin/${event.target.id}`, { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.text()
    })
    .then(text => {
      let properties = JSON.parse(text).properties;
      details = ""
      properties.forEach(p => details += p.name + ": " + p.details + '<br>');
      display = event.target.parentNode
      display.innerHTML = details
      handleDisplay(display)
      return text
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function getTooltip(tippyInstance, url) {
  fetch(`https://swn-generate.herokuapp.com/create/pc/tooltip/origin/${url}`, { method: 'GET' })
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

function generateTooltip(display, properties) {
  const tippyInstance = tippy(display, {
    arrow: false,
    placement: 'left',
    animation: 'scale',
    interactive: true,
    delay: [0, 100]
  })
  getTooltip(tippyInstance, element.endpoint + "/" + properties[0].details.split(" ")[0].toLowerCase().replace(/\W/g, ""))
}

function handleDisplay(display){
  shutdown(display)
  next = display.nextElementSibling
  if(next != null){
    activate(next)
  } 
}

function shutdown(display){
  display.style.display = "flex"
  display.childNodes.forEach(child => {
    if(child.nodeName.includes("BUTTON")){
      child.style.display = "none";
    }   
  });
}
function activate(display){
  display.childNodes.forEach(child => {
    if(child.nodeName.includes("BUTTON")){
      child.style.display = "block";
    }   
  });
}

function createTippyInstance(display) {
  return tippy(display, {
    arrow: false,
    placement: 'left',
    animation: 'scale',
    interactive: false,
    delay: [0, 1]
  })
}

function initPreset(element){
  id = element.id
  element.innerHTML = id.charAt(0).toUpperCase() + id.slice(1)
  element.addEventListener('click', presetClick);
  getTooltip(createTippyInstance(element), element.id)
}

document.getElementById("stat-block").addEventListener('click', handleGenerateClick);
document.getElementById("origin").addEventListener('click', handleGenerateClick);
initPreset(document.getElementById("barbarian"))
initPreset(document.getElementById("clergy"))
initPreset(document.getElementById("courtesan"))
initPreset(document.getElementById("criminal"))
initPreset(document.getElementById("dilettante"))
initPreset(document.getElementById("entertainer"))
initPreset(document.getElementById("merchant"))
initPreset(document.getElementById("noble"))
initPreset(document.getElementById("official"))
initPreset(document.getElementById("peasant"))
initPreset(document.getElementById("physician"))
initPreset(document.getElementById("pilot"))
initPreset(document.getElementById("politician"))
initPreset(document.getElementById("scholar"))
initPreset(document.getElementById("soldier"))
initPreset(document.getElementById("spacer"))
initPreset(document.getElementById("technician"))
initPreset(document.getElementById("thug"))
initPreset(document.getElementById("vagabond"))
initPreset(document.getElementById("worker"))
handleDisplay(document.getElementById("title"))

//document.getElementById("barbarian-button").style.display = "none"
//document.getElementById("barbarian-button").addEventListener('click', barbarianClick);