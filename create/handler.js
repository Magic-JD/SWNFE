import { presetClickRequest, handleGenerateClickRequest, getTooltipRequest } from "./requests.js";
import { handleDisplay } from "./display.js";


export function handleGenerateClick(event) {
  process(event, handleGenerateClickRequest(event))
}

export function presetClick(event) {
  process(event, presetClickRequest(event))
}

export function getTooltip(tippyInstance, url) {
  getTooltipRequest(url)
    .then(text => {
      tippyInstance.setContent(text.replace(/\n/g, '<br>').replace("'", "&#39;"))
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function process(event, future) {
  future.then(text => {
    let properties = JSON.parse(text).properties;
    let details = ""
    properties.forEach(p => details += p.name + ": " + p.details.replace(/\n/g, '<br>').replace("'", "&#39;") + '<br>');
    let display = event.target.parentNode
    display.innerHTML = details
    handleDisplay(display)
  })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}