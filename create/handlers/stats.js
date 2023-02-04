import { process, handleGenerateClickRequest } from "./requests/requests.js";
import { handleDisplay, shutdown } from "../display/display.js";

let names = null;
const pickValues = ["14 [+1]", "12 [0]", "11 [0]", "10 [0]", "9 [0]", "7 [-1]"]
let pickValueIndex = 0
let statsInfoElement = null;

export function initStatNames() {
  handleGenerateClickRequest("stat-block/names").then(text => {
    names = JSON.parse(text).propertyNames;
  })
}

export function handleClickPickStats(event) {
  let display = event.target.parentNode
  statsInfoElement = createStatsInfoElement(createStatApplyString(), display)
  shutdown(display)
  names.forEach(s => {
    if (s) {
      display.append(createStatAddButton(s.toLowerCase, s, pickStatListener));
    }
  })
}

function createStatsInfoElement(string, parentNode) {
  const element = document.createElement("div");
  element.style.clear = "both";
  element.style.display = "flex";
  element.style.justifyContent = "center";
  parentNode.insertAdjacentElement("beforebegin", element);
  element.innerHTML = string
  return element
}

function createStatApplyString(){
  return `Apply ${pickValues[pickValueIndex]} to the selected stat.`
}

function pickStatListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  parentNode.removeChild(element)
  statsInfoElement.innerHTML += "<br>" + event.target.innerHTML + ": " + pickValues[pickValueIndex]
  pickValueIndex+=1
  let outOfIndex = pickValueIndex >= pickValues.length
  statsInfoElement.innerHTML = alphabetizeString(statsInfoElement.innerHTML, outOfIndex)
  if(outOfIndex){
    handleDisplay(parentNode)
  }
}

function alphabetizeString(string, outOfIndex){
  let list = string.split('<br>')
  if(outOfIndex){
    list.shift()
  }else {
    list[0] = createStatApplyString()
  }
  
  return list.sort().join('<br>')
}

function createStatAddButton(id, details, listener) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  element.addEventListener("click", listener);
  return element
}

export function handleGenerateClickStats(event) {
  handleGenerateClickRequest("stat-block").then(
    text => {
      let properties = JSON.parse(text).properties;
      let details = ""
      properties.forEach(p => details += statsToString(p));
      let display = event.target.parentNode
      statsInfoElement = createStatsInfoElement(`Apply ${pickValues[0]} to chosen stat<br>${details}`, display)
      shutdown(display)
      names.forEach(s => {
        if (s) {
          display.append(createStatAddButton(s.toLowerCase, s, pickStatClickListener));
        }
      })
    }
  )
}

function pickStatClickListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  handleDisplay(parentNode)
  let list = statsInfoElement.innerHTML.split('<br>')
  list.shift()
  list = list.map(s => {
    if(s.startsWith(element.innerHTML)){
      return `${element.innerHTML}: ${pickValues[pickValueIndex]}`
    }
    return s
  })
  statsInfoElement.innerHTML = list.join('<br>')
}

function statsToString(property) {
  return property.name + ": " + property.details.replace(/\n/g, '<br>').replace("'", "&#39;") + '<br>'
}