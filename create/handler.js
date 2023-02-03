import { presetClickRequest, handleGenerateClickRequest, makeUsersRequest } from "./requests.js";
import { handleDisplay } from "./display.js";

let quickSkills = "";
let growth = "";
let learning = "";
const quickSkillsName = "Quick Skills"
const growthName = "Growth"
const learningName = "Learning"


export function handleGenerateClickStats(event) {
  process(event, handleGenerateClickRequest(event), statsToString)
}

export function handleGenerateClickOrigin(event) {
  process(event, handleGenerateClickRequest(event), originToString)
}

export function handleSkillsButton(event){
  const id = event.target.id;
  if(id == "skills-quick"){
      setDoc(event, quickSkills)
  }
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

function setDoc(event, string){
  let display = event.target.parentNode
  display.innerHTML = string
  handleDisplay(display)
}

function statsToString(property){
  return property.name + ": " + property.details.replace(/\n/g, '<br>').replace("'", "&#39;") + '<br>'
}

function originToString(property){
  const checkName = property.name.replace(/\n/g, '')
  if(checkName == quickSkillsName){
    quickSkills = property.details;
  } else if(checkName == growthName){
    growth = property.details;
  } else if(checkName == learningName){
    learning = property.details;
  }
  return property.name + ": " + property.details.replace(/\n/g, '<br>').replace(":", '<br>').replace("'", "&#39;") + '<br>' + '<br>'
}