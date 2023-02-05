import { process, handleGenerateClickRequest } from "./requests/requests.js";
import { handleDisplay, shutdown } from "../display/display.js";

let statProperties = null;
const pickValues = ["14 [+1]", "12 [0]", "11 [0]", "10 [0]", "9 [0]", "7 [-1]"]
let pickValueIndex = 0
let statsInfoElement = null;

export function initStatNames() {
  handleGenerateClickRequest("stat-block").then(text => {
    statProperties = JSON.parse(text).properties.sort((a, b) => a.priority - b.priority);
  })
}

export function handleClickPickStats(event) {
  let display = event.target.parentNode
  statsInfoElement = createStatsInfoElement(createStatApplyString(), display)
  shutdown(display)
  statProperties.forEach(p => {
    display.append(createStatAddButton(p.name.toLowerCase, p.name, pickStatListener));
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

function createStatApplyString() {
  return `Apply ${pickValues[pickValueIndex]} to the selected stat.`
}

function pickStatListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  parentNode.removeChild(element)
  statsInfoElement.innerHTML += "<br>" + event.target.innerHTML + ": " + pickValues[pickValueIndex]
  pickValueIndex += 1
  let outOfIndex = pickValueIndex >= pickValues.length
  statsInfoElement.innerHTML = sortStats(statsInfoElement.innerHTML, outOfIndex)
  if (outOfIndex) {
    handleDisplay(parentNode)
  }
}

function sortStats(string, outOfIndex) {
  let list = string.split('<br>')
  list.shift()
  string = list.sort((a, b) => statProperties.find(e2 => e2.name == a.split(":")[0]).priority - statProperties.find(e1 => e1.name == b.split(":")[0]).priority).join('<br>')
  if (outOfIndex) {
    return string
  } else {
    return createStatApplyString() + "<br>" + string
  }
}

function createStatAddButton(id, details, listener) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  element.addEventListener("click", listener);
  return element
}

export function handleGenerateClickStats(event) {
  let details = ""
  statProperties.forEach(p => details += statsToString(p));
  let display = event.target.parentNode
  statsInfoElement = createStatsInfoElement(`Apply ${pickValues[0]} to chosen stat<br>${details}`, display)
  shutdown(display)
  statProperties.forEach(p => {
    display.append(createStatAddButton(p.name.toLowerCase, p.name, pickStatClickListener));
  })
}

function pickStatClickListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  handleDisplay(parentNode)
  let list = statsInfoElement.innerHTML.split('<br>')
  list.shift()
  list = list.map(s => {
    if (s.startsWith(element.innerHTML)) {
      return `${element.innerHTML}: ${pickValues[pickValueIndex]}`
    }
    return s
  })
  statsInfoElement.innerHTML = list.join('<br>')
}

function statsToString(property) {
  return `${property.name}: ${property.value} ${property.mod}<br>`
}