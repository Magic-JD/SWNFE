import { setDoc, shutdown, handleDisplay } from "../display/display.js";
import { createTippyInstance } from "../tippy/tippy.js";
import { makeRollOnTableRequest, makeSkillsUpdateRequest } from "./requests/requests.js";


let freeSkill = "";
let quickSkills = "";
let growth = "";
let learning = "";
export const freeSkillName = "Free Skill"
export const quickSkillsName = "Quick Skills"
export const growthName = "Growth"
export const learningName = "Learning"
let skillsInfoElement = null;
let skillsRollCount = 0;
let skills = []
let availableSkills = []


export function setFreeSkill(s) {
  freeSkill = s
}

export function setQuickSkills(s) {
  quickSkills = s
}

export function setGrowth(s) {
  growth = s
}

export function setLearning(s) {
  learning = s
}

export function addSkillsTooltip(element) {
  const id = element.id;
  if (id == "skills-quick") {
    createTippyInstance(element).setContent(quickSkillsName + "<br>" + quickSkills.replace(/\n/g, '<br>'));
  } else if (id == "skills-pick") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + freeSkill + "<br><br>" + learningName + "<br>" + learning.replace(/\n/g, '<br>'));
  } else if (id == "skills-roll") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + freeSkill + "<br><br>" + growthName + "<br>" + growth.replace(/\n/g, '<br>') + "<br><br>" + learningName + "<br>" + learning.replace(/\n/g, '<br>'));
  }
}

export function handleSkillsButton(event) {
  const button = event.target;
  const id = button.id;
  skills.push(freeSkill)
  if (id == "skills-quick") {
    setDoc(event, quickSkills.replace(/\n/g, '<br>'))
  } else if (id == "skills-pick") {
    availableSkills = learning.split(/\n/g).filter(s => s)
    makeSkillsUpdateRequest(skills, null, availableSkills).then(text => {
      availableSkills = JSON.parse(text).choices;
      const parentNode = button.parentNode
      createSkillInfoElement(skills, parentNode)
      shutdown(parentNode)
      parentNode.style.display = "grid"
      parentNode.style.gridTemplateColumns = "repeat(4, 1fr)"
      parentNode.style.gridGap = "16px"
      skillsRollCount = 1
      availableSkills.forEach(choice => {
        parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name));
      })
    });

  } else if (id == "skills-roll") {
    const parentNode = button.parentNode
    createSkillInfoElement(skills, parentNode)
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
    makeSkillsUpdateRequest(skills, details, availableSkills.map(skill => skill.name)).then(text => {
      const furtherChoices = JSON.parse(text)
      shutdown(element.parentNode)
      if (furtherChoices.followUp.length > 0) {
        furtherChoices.followUp.forEach(choice => {
          element.parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name));
        })
      } else {
        skillsInfoElement.innerHTML += "<br>" + furtherChoices.toAdd;
        skills.push(furtherChoices.toAdd)
        furtherChoices.choices.forEach(choice => {
          element.parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name));
        })
        updateRolls(element.parentElement)
      }




    })

  });
  return element
}

function handleRollOnTableGrowth(event) {
  handleRollOnTable(event, makeRollOnTableRequest(growthName, growth))
}

function handleRollOnTableLearning(event) {
  handleRollOnTable(event, makeRollOnTableRequest(learningName, learning))
}

function handleRollOnTable(event, fun) {
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

function createSkillInfoElement(strings, parentNode) {
  if (!skillsInfoElement) {
    const element = document.createElement("div");
    element.style.clear = "both";
    element.style.display = "flex";
    element.style.justifyContent = "center";
    parentNode.insertAdjacentElement("beforebegin", element);
    skillsInfoElement = element
  }
  skillsInfoElement.innerHTML = strings.join('<br>')
}