import { presetClickRequest, handleGenerateClickRequest, makeUsersRequest, makeRollOnTableRequest } from "./requests.js";
import { handleDisplay, shutdown } from "./display.js";
import { createTippyInstance } from "./tippy.js";

let freeSkill = "";
let quickSkills = "";
let growth = "";
let learning = "";
const freeSkillName = "Free Skill"
const quickSkillsName = "Quick Skills"
const growthName = "Growth"
const learningName = "Learning"
let skillsInfoElement = null;
let skillsRollCount = 0;


export function addTooltip(element){
  const id = element.id;
  if (id == "skills-quick") {
    createTippyInstance(element).setContent(quickSkillsName + "<br>" + quickSkills.replace(/\n/g, '<br>'))
  } else if (id == "skills-pick") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + freeSkill + "<br><br>" + learningName + "<br>" + learning.replace(/\n/g, '<br>'))
  } else if (id == "skills-roll") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + freeSkill + "<br><br>" + growthName + "<br>" + growth.replace(/\n/g, '<br>') + "<br><br>" + learningName + "<br>" + learning.replace(/\n/g, '<br>'))
  }
}

export function handleGenerateClickStats(event) {
  process(event, handleGenerateClickRequest(event), statsToString)
}

export function handleGenerateClickOrigin(event) {
  process(event, handleGenerateClickRequest(event), originToString)
}

export function handleSkillsButton(event) {
  const button = event.target;
  const id = button.id;
  if (id == "skills-quick") {
    setDoc(event, quickSkills.replace(/\n/g, '<br>'))
  } else if (id == "skills-pick") {
    const parentNode = button.parentNode
    createSkillInfoElement(freeSkill, parentNode)
    shutdown(parentNode)
    parentNode.style.display = "grid"
    parentNode.style.gridTemplateColumns = "repeat(4, 1fr)"
    parentNode.style.gridGap = "16px"
    skillsRollCount = 1
    learning.split(/\n/g).forEach(s => {
      if(s){
        parentNode.prepend(createSkillAddButton(s.toLowerCase, s));
      }
      
    })
  } else if (id == "skills-roll") {
    const parentNode = button.parentNode
    createSkillInfoElement(freeSkill, parentNode)
    shutdown(parentNode)
    parentNode.prepend(createSkillRollOnTableButton("growth", growthName, handleRollOnTableGrowth));
    parentNode.prepend(createSkillRollOnTableButton("learning", learningName, handleRollOnTableLearning));
  }
}

function createSkillRollOnTableButton(id, details, listener) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  element.addEventListener("click", listener);
  return element
}

function createSkillAddButton(id, details) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  element.addEventListener("click", event => {
    skillsInfoElement.innerHTML += "<br>" + details;
    updateRolls(element.parentElement)
  });
  return element
}

function handleRollOnTableGrowth(event) {
  handleRollOnTable(event, makeRollOnTableRequest(growthName, growth))
}

function handleRollOnTableLearning(event) {
  handleRollOnTable(event, makeRollOnTableRequest(learningName, learning))
}

function handleRollOnTable(event, fun){
  fun.then(text => {
    let property = JSON.parse(text);
    skillsInfoElement.innerHTML += "<br>" + property.name + ": " + property.details
    updateRolls(event.target.parentNode)
  }).catch(error => {
    console.error('Error fetching data:', error)
  })
}

function updateRolls(parentNode) {
  skillsRollCount += 1;
  if (skillsRollCount == 3) {
    handleDisplay(parentNode);
  }
}

function createSkillInfoElement(string, parentNode) {
  const element = document.createElement("div");
  element.style.clear = "both";
  element.style.display = "flex";
  element.style.justifyContent = "center";
  parentNode.insertAdjacentElement("beforebegin", element);
  element.innerHTML = string
  skillsInfoElement = element
}

export function handlePresetClickOrigin(event) {
  process(event, presetClickRequest(event), originToString)
}

export function handleUsersRequest() {
  return makeUsersRequest()
    .then(text => {
      let users = JSON.parse(text).origins;
      return users;
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function process(event, future, handleFunction) {
  future.then(text => {
    let properties = JSON.parse(text).properties;
    let details = ""
    properties.forEach(p => details += handleFunction(p));
    setDoc(event, details)
  })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
}

function setDoc(event, string) {
  let display = event.target.parentNode
  display.innerHTML = string
  handleDisplay(display)
}

function statsToString(property) {
  return property.name + ": " + property.details.replace(/\n/g, '<br>').replace("'", "&#39;") + '<br>'
}

function originToString(property) {
  const checkName = property.name.replace(/\n/g, '').replace(/^\s*[\r\n]/gm, '');
  const details = property.details.replace(/-0/g, '').replace(/^\s*[\r\n]/gm, '');
  if (checkName == freeSkillName) {
    freeSkill = details;
  } else if (checkName == quickSkillsName) {
    quickSkills = details;
  } else if (checkName == growthName) {
    growth = details;
  } else if (checkName == learningName) {
    learning = details;
  } else {
    return property.name + ": " + property.details.replace(/\n/g, '<br>').replace(":", '<br>').replace("'", "&#39;") + '<br>' + '<br>'
  }
  return ""
}