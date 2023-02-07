import { handleGenerateClickRequest } from "./requests/requests.js";
import { getDisplay } from "../display/display.js";
import { getPC, Stat } from "../pc/pc.js";

const pickValues = ["14 [+1]", "12 [0]", "11 [0]", "10 [0]", "9 [0]", "7 [-1]"]
let pickValueIndex = 0
let display = getDisplay();
let pc = getPC()

export function initStatNames() {
  handleGenerateClickRequest("stat-block").then(text => {
    pc.stats = JSON.parse(text).properties.map(p => new Stat(p.name, p.value, p.mod, p.priority)).sort((a, b) => a.priority - b.priority);
  })
}

export function handleClickPickStats(event) {
  display.replaceText(createStatApplyString())
  display.clear()
  pc.stats.forEach(p => {
    event.target.parentNode.append(createStatAddButton(p.name.toLowerCase, p.name, pickStatListener));
  })
}

function createStatApplyString() {
  return `Apply ${pickValues[pickValueIndex]} to the selected stat.`
}

function pickStatListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  parentNode.removeChild(element)
  display.addText("<br>" + event.target.innerHTML + ": " + pickValues[pickValueIndex]) 
  pickValueIndex += 1
  let outOfIndex = pickValueIndex >= pickValues.length
  display.replaceText(sortStats(display.retrieveText(), outOfIndex))
  if (outOfIndex) {
    display.update()
  }
}

function sortStats(string, outOfIndex) {
  let list = string.split('<br>')
  list.shift()
  string = list.sort((a, b) => pc.stats.find(e2 => e2.name == a.split(":")[0]).priority - pc.stats.find(e1 => e1.name == b.split(":")[0]).priority).join('<br>')
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
  pc.stats.forEach(p => details += statsToString(p));
  display.addText(`Apply ${pickValues[0]} to chosen stat<br>${details}`)
  display.clear()
  pc.stats.forEach(p => {
    event.target.parentNode.append(createStatAddButton(p.name.toLowerCase, p.name, pickStatClickListener));
  })
}

function pickStatClickListener(event) {
  const element = event.target  
  let list = display.retrieveText().split('<br>')
  list.shift()
  list = list.map(s => {
    if (s.startsWith(element.innerHTML)) {
      return `${element.innerHTML}: ${pickValues[pickValueIndex]}`
    }
    return s
  })
  display.replaceText(list.join('<br>'))
  display.update()
}

function statsToString(property) {
  return `${property.name}: ${property.value} ${property.mod}<br>`
}