import { createTippyInstance } from "../tippy/tippy.js";
import { makeRollOnTableRequest, makeSkillsUpdateRequest } from "./requests/requests.js";
import { getDisplay } from "../display/display.js";
import { getPC } from "../pc/pc.js";

export const freeSkillName = "Free Skill"
export const quickSkillsName = "Quick Skills"
export const growthName = "Growth"
export const learningName = "Learning"
let skillsRollCount = 0;
let availableSkills = []

let display = getDisplay();
let pc = getPC()
let statCount = 0

export function addSkillsTooltip(element) {
  const id = element.id;
  if (id == "skills-quick") {
    createTippyInstance(element).setContent(quickSkillsName + "<br>" + pc.origin.quickSkills.join('<br>'));
  } else if (id == "skills-pick") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + pc.origin.freeSkill + "<br><br>" + learningName + "<br>" + pc.origin.learning.join('<br>'));
  } else if (id == "skills-roll") {
    createTippyInstance(element).setContent(freeSkillName + "<br>" + pc.origin.freeSkill + "<br><br>" + growthName + "<br>" + pc.origin.growth.join('<br>') + "<br><br>" + learningName + "<br>" + pc.origin.learning.join('<br>'));
  }
}

export function handleSkillsRollButton(event) {
  const parentNode = event.target.parentNode
  makeSkillsUpdateRequest([], pc.origin.freeSkill, []).then(text => {
    const furtherSkills = JSON.parse(text)
    skillsRollCount = -1;
    followUpOrReInit(furtherSkills, parentNode, choiceToGenerate, () => skillsGenerateReinit(furtherSkills, parentNode))
  });
}

export function handleSkillsPickButton(event) {
  const parentNode = event.target.parentNode;
  availableSkills = pc.origin.learning.filter(s => s != "Any Skill");
  makeSkillsUpdateRequest([], pc.origin.freeSkill, availableSkills).then(text => {
    const furtherSkills = JSON.parse(text);
    availableSkills = furtherSkills.choices;
    display.clear();
    display.setToGrid();
    followUpOrReInit(furtherSkills, parentNode, choiceToSkill, () => skillsPickReinit(furtherSkills, parentNode))
  });
}

function skillsPickReinit(furtherSkills, parentNode) {
  pc.addSkill(furtherSkills.toAdd);
  skillsRollCount = 1;
  skillsForEach(parentNode, choiceToSkill);
}

function skillsForEach(parentNode, fun) {
  availableSkills.forEach(choice => {
    parentNode.prepend(fun(choice));
  });
}

function addButtonReInit(furtherChoices, parentNode) {
  simpleReinit(furtherChoices)
  furtherChoices.choices.forEach(choice => {
    parentNode.prepend(createSkillButton(choice.name.toLowerCase, choice.name, skillAddButtonListener(choice.name), choice.description));
  });
}

function skillsGenerateReinit(furtherSkills, parentNode) {
  simpleReinit(furtherSkills)
  addGrowthAndLearningListeners(parentNode);
}

function simpleReinit(furtherSkills) {
  pc.addSkill(furtherSkills.toAdd);
  updateRolls();
}

export function handleQuickSkillsButton(event) {
  const parentNode = event.target.parentNode
  pc.origin.quickSkills.forEach(skill => makeSkillsUpdateRequest([], skill, []).then(text => {
    const furtherSkills = JSON.parse(text);
    followUpOrReInit(furtherSkills, parentNode, choiceToSkill, () => simpleReinit(furtherSkills, parentNode));
  }));
}

function choiceToSkill(choice) {
  return createSkillButton(choice.name.toLowerCase, choice.name, skillAddButtonListener(choice.name), choice.description);
}

function choiceToGenerate(choice) {
  return createSkillButton(choice.name.toLowerCase, choice.name, addButtonFromGenerateListener(choice.name), choice.description);
}

function followUpOrReInit(furtherSkills, parentNode, followUpFunction, reinitFunction) {
  display.clear();
  display.setToGrid();
  if (furtherSkills.followUp.length > 0) {
    furtherSkills.followUp.forEach(choice => {
      parentNode.prepend(followUpFunction(choice));
    });
  } else {
    reinitFunction();
  }
}

function createSkillButton(id, details, listener, description) {
  const element = document.createElement("button");
  element.id = id
  element.innerHTML = details
  if (description) {
    createTippyInstance(element).setContent(description);
  }
  element.addEventListener("click", listener);
  return element
}

function addButtonFromGenerateListener(details) {
  return event => {
    makeSkillsUpdateRequest(pc.skills, details, availableSkills.map(skill => skill.name)).then(text => {
      const furtherChoices = JSON.parse(text);
      const parentNode = event.target.parentNode
      display.clear();
      pc.addSkill(furtherChoices.toAdd);
      addGrowthAndLearningListeners(parentNode);
      updateRolls();
    });
  };
}


function skillAddButtonListener(details) {
  return event => {
    makeSkillsUpdateRequest(pc.skills, details, availableSkills.map(skill => skill.name)).then(text => {
      const furtherChoices = JSON.parse(text);
      const parentNode = event.target.parentNode
      followUpOrReInit(furtherChoices, parentNode, choiceToSkill, () => addButtonReInit(furtherChoices, parentNode));
    });
  };
}

function handleRollOnTable(parentNode, fun) {
  fun.then(text => {
    let furtherChoices = JSON.parse(text);
    followUpOrReInit(furtherChoices, parentNode, choiceToGenerate, () => rollReInit(furtherChoices, parentNode));
  })
}

function rollReInit(furtherChoices, parentNode) {
  if (furtherChoices.toAdd.startsWith('+')) {
    const growStats = furtherChoices.toAdd
    const statsList = pc.stats
    display.clear()
    display.addText(furtherChoices.toAdd + '<br>')
    if (growStats == "+2 Physical") {
      statCount = 2
      statsList.slice(0, 3).filter(stat => stat.value < 18)
        .forEach(stat => { parentNode.append(createSkillButton(stat.name.toLowerCase, stat.name, growthAddStatListener(stat))) })
    } else if (growStats == "+2 Mental") {
      statCount = 2
      statsList.slice(3, 6).filter(stat => stat.value < 18)
        .forEach(stat => { parentNode.append(createSkillButton(stat.name.toLowerCase, stat.name, growthAddStatListener(stat))) })
    } else {
      statCount = 1
      statsList.filter(stat => stat.value < 18)
        .forEach(stat => { parentNode.append(createSkillButton(stat.name.toLowerCase, stat.name, growthAddStatListener(stat))) })
    }
  } else {
    simpleReinit(furtherChoices)
    addGrowthAndLearningListeners(parentNode);
  }
}

function growthAddStatListener(stat) {
  return event => {
    let currentValue = stat.value;
    currentValue += 1
    pc.updateStat(stat.name, currentValue)
    statCount-=1
    if (statCount <= 0) {
      addGrowthAndLearningListeners(event.target.parentNode)
      updateRolls()
    } else if (currentValue == 18) {
      event.target.style.display = "none"
    }
  };
}

function addGrowthAndLearningListeners(parentNode) {
  display.clear()
  parentNode.prepend(createSkillButton("growth", growthName, function (event) {
    handleRollOnTable(event.target.parentNode, makeRollOnTableRequest(pc.skills, growthName, pc.origin.growth.join('\n')))
  }, pc.origin.growth.join('<br>')));
  parentNode.prepend(createSkillButton("learning", learningName, function (event) {
    handleRollOnTable(event.target.parentNode, makeRollOnTableRequest(pc.skills, learningName, pc.origin.learning.join('\n')))
  }, pc.origin.learning.join('<br>')));
}

function updateRolls() {
  skillsRollCount += 1;
  if (skillsRollCount == 3) {
    display.update();
  }
}