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
  createSkillInfoElement(skills, event.target.parentNode)
  const button = event.target;
  const id = button.id;
  if (id == "skills-quick") {
    skills = quickSkills.split(/\n/g);
    shutdown(event.target.parentNode)
    skills.forEach(skill => makeSkillsUpdateRequest([], skill, []).then(text => {
      const furtherSkills = JSON.parse(text)
      
      if (furtherSkills.followUp.length > 0) {
        furtherSkills.followUp.forEach(choice => {
          event.target.parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name, choice.description));
        })
      } else {
        skillsInfoElement.innerHTML += "<br>" + furtherSkills.toAdd;
        updateRolls(event.target.parentNode)
      }
    }))
  } else if (id == "skills-pick") {
    availableSkills = learning.split(/\n/g).filter(s => s).filter(s => s != "Any Skill")
    makeSkillsUpdateRequest([], freeSkill, availableSkills).then(text => {
      const furtherSkills = JSON.parse(text)
      availableSkills = furtherSkills.choices;
      const parentNode = button.parentNode
      shutdown(parentNode)
      parentNode.style.display = "grid"
      parentNode.style.gridTemplateColumns = "repeat(4, 1fr)"
      parentNode.style.gridGap = "16px"
      if (furtherSkills.followUp.length > 0) {
        furtherSkills.followUp.forEach(choice => {
          parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name, choice.description));
        })
      } else {
        skillsInfoElement.innerHTML = furtherSkills.toAdd
        skills.push(furtherSkills.toAdd)
        skillsRollCount = 1
        availableSkills.forEach(choice => {
          parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name, choice.description));
        })
      }
    });
  } else if (id == "skills-roll") {
    makeSkillsUpdateRequest([], freeSkill, []).then(text => {
      const furtherSkills = JSON.parse(text)
      const parentNode = button.parentNode
      shutdown(parentNode)
      parentNode.style.display = "grid"
      parentNode.style.gridTemplateColumns = "repeat(4, 1fr)"
      parentNode.style.gridGap = "16px"
      skillsRollCount = -1;
      if (furtherSkills.followUp.length > 0) {
        furtherSkills.followUp.forEach(choice => {
          parentNode.prepend(createSkillAddButtonFromGenerate(choice.name.toLowerCase, choice.name, choice.description));
        })
      } else {
        skillsInfoElement.innerHTML = furtherSkills.toAdd
        skills.push(furtherSkills.toAdd)
        parentNode.prepend(createSkillRollOnTableButton("growth", growthName, handleRollOnTableGrowth));
        parentNode.prepend(createSkillRollOnTableButton("learning", learningName, handleRollOnTableLearning));
        updateRolls(parentNode)
      }
    });
  }
}

function createSkillRollOnTableButton(id, details, listener) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  element.addEventListener("click", listener);
  return element
}

function createSkillAddButtonFromGenerate(id, details, description) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  if(description){
    createTippyInstance(element).setContent(description);
  }
  element.addEventListener("click", event => {
    makeSkillsUpdateRequest(skills, details, availableSkills.map(skill => skill.name)).then(text => {
      const furtherChoices = JSON.parse(text)
      shutdown(element.parentNode)
      skillsInfoElement.innerHTML += "<br>" + furtherChoices.toAdd;
      skills.push(furtherChoices.toAdd)
      element.parentNode.prepend(createSkillRollOnTableButton("growth", growthName, handleRollOnTableGrowth));
      element.parentNode.prepend(createSkillRollOnTableButton("learning", learningName, handleRollOnTableLearning));
      updateRolls(element.parentNode)
    })
  });
  return element
}


function createSkillAddButton(id, details, description) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  if(description){
    createTippyInstance(element).setContent(description);
  }
  element.addEventListener("click", event => {
    makeSkillsUpdateRequest(skills, details, availableSkills.map(skill => skill.name)).then(text => {
      const furtherChoices = JSON.parse(text)
      shutdown(element.parentNode)
      if (furtherChoices.followUp.length > 0) {
        furtherChoices.followUp.forEach(choice => {
          element.parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name, choice.description));
        })
      } else {
        skillsInfoElement.innerHTML += "<br>" + furtherChoices.toAdd;
        skills.push(furtherChoices.toAdd)
        furtherChoices.choices.forEach(choice => {
          element.parentNode.prepend(createSkillAddButton(choice.name.toLowerCase, choice.name, choice.description));
        })
        updateRolls(element.parentElement)
      }
    })
  });
  return element
}

function handleRollOnTableGrowth(event) {
  handleRollOnTable(event, makeRollOnTableRequest(skills, growthName, growth))
}

function handleRollOnTableLearning(event) {
  handleRollOnTable(event, makeRollOnTableRequest(skills, learningName, learning))
}

function handleRollOnTable(event, fun) {
  fun.then(text => {
    let furtherChoices = JSON.parse(text);
    const parentNode = event.target.parentNode
    shutdown(parentNode)
    if (furtherChoices.followUp.length > 0) {
      furtherChoices.followUp.forEach(choice => {
        parentNode.prepend(createSkillAddButtonFromGenerate(choice.name.toLowerCase, choice.name));
      })
    } else {
      skills.push(furtherChoices.toAdd)
      skillsInfoElement.innerHTML += "<br>" + furtherChoices.toAdd ;
      parentNode.prepend(createSkillRollOnTableButton("growth", growthName, handleRollOnTableGrowth));
      parentNode.prepend(createSkillRollOnTableButton("learning", learningName, handleRollOnTableLearning));
      updateRolls(event.target.parentNode)
    }
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