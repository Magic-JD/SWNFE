import { handleGenerateClickRequest } from "./requests/requests.js";
import { getDisplay } from "../display/display.js";
import { getPC, Stat } from "../pc/pc.js";

const pickValues = [{ value: 14, mod: '[+1]' }, { value: 12, mod: '[0]' }, { value: 11, mod: '[0]' }, { value: 10, mod: '[0]' }, { value: 9, mod: '[0]' }, { value: 7, mod: '[-1]' }]
let pickValueIndex = 0
let display = getDisplay();
let pc = getPC()

export function initStatNames() {

}

export function handleClickPickStats(event) {
  handleGenerateClickRequest("stat-block").then(text => {
    pc.setStats(JSON.parse(text).properties.map(p => new Stat(p.name, p.value, p.priority)));
    display.replaceText(createStatApplyString())
    display.clear()
    pc.stats.forEach(stat => {
      stat.value = 0;
      event.target.parentNode.append(createStatAddButton(stat.name.toLowerCase, stat.name, pickStatListener));
    })
  })

}

function createStatApplyString() {
  return `Apply ${pickValues[pickValueIndex].value} ${pickValues[pickValueIndex].mod} to the selected stat.<br>`
}

function pickStatListener(event) {
  const element = event.target
  const parentNode = element.parentNode
  parentNode.removeChild(element)
  pc.updateStat(element.innerHTML, pickValues[pickValueIndex].value)
  pickValueIndex += 1
  let outOfIndex = pickValueIndex >= pickValues.length
  if (outOfIndex) {
    display.replaceText("")
    display.update()
  } else {
    display.replaceText(createStatApplyString())
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
  handleGenerateClickRequest("stat-block").then(text => {
    pc.setStats(JSON.parse(text).properties.map(p => new Stat(p.name, p.value, p.priority)));
    display.addText(createStatApplyString())
    display.clear()
    pc.stats.forEach(p => {
      event.target.parentNode.append(createStatAddButton(p.name.toLowerCase, p.name, pickStatClickListener));
    })
  })

}

function pickStatClickListener(event) {
  const element = event.target
  pc.updateStat(element.innerHTML, pickValues[pickValueIndex].value)
  display.replaceText("")
  display.update()
}