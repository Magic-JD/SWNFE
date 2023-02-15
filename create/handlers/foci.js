import { makeAllFociRequest, makeSkillsUpdateRequest } from "./requests/requests.js";
import { getPC } from "../pc/pc.js";
import { createTippyInstance } from "../tippy/tippy.js";
import { getDisplay } from "../display/display.js";


class Foci {
    constructor(name, restriction, skill, description, level1, level2) {
        this.name = name,
            this.restriction = restriction,
            this.skill = skill,
            this.description = description,
            this.level1 = level1,
            this.level2 = level2,
            this.currrentLevel = 0;
        this.increaseLevel = function () { this.currrentLevel += 1 }
    }
}


let allFoci = []
const pc = getPC()
const display = getDisplay()
let count = 1

export function handleAllFociRequest() {
    makeAllFociRequest().then(text => {
        const foci = JSON.parse(text).foci
        allFoci = foci.map(foci => { return new Foci(foci.name, foci.restriction, foci.skill, foci.description, foci.level1, foci.level2) })
    })
}

export function showFoci() {
    let classList = pc.class
    let isWarrior = classList.filter(s => s.includes("Warrior")).length != 0
    let isExpert = classList.filter(s => s.includes("Expert")).length != 0
    if (isExpert || isWarrior) {
        if (isExpert) {
            count += 1
        }
        if (isWarrior) {
            count += 1
        }
        if (isExpert) {
            return pickFromExpert()

        }
        if (isWarrior) {
            return pickFromWarrior()
        }

    }
    else {
        return pickFromAll(classList);
    }

}



function pickFromWarrior() {
    display.clear()
    allFoci.filter(f => f.restriction == "Combat").forEach(foci => createFociButton(foci, warriorListener))
}

function pickFromExpert() {
    display.clear()
    allFoci.filter(f => f.restriction == "Non Combat").forEach(foci => createFociButton(foci, expertListener))
}

function pickFromAll(classList) {
    display.clear()
    allFoci.filter(f => fociCompatable(f, classList)).forEach(foci => createFociButton(foci, allListener))
}

function createFociButton(foci, listener) {
    const element = document.createElement("button");
    element.id = foci.name.toLowerCase
    element.innerHTML = foci.name
    element.addEventListener("click", listener);
    const tippyInstance = createTippyInstance(element)
    tippyInstance.setContent(`<div style="text-align: center; padding: 0px; font-size: 12px">${foci.description}<br><br>${foci.level1}<br><br>${foci.level2}</div>`)
    display.div.append(element)
}

function createSkillButton(skill, listener) {
    const element = document.createElement("button");
    element.id = skill.toLowerCase
    element.innerHTML = skill
    element.addEventListener("click", listener);
    display.div.append(element)
}

function skillListener(event) {
    pc.addSkill(event.target.innerHTML)
    count -= 1
    if (count == 2) {
        pickFromWarrior()
    } else if (count == 1) {
        pickFromAll(pc.class)
    } else {
        display.update()
    }

}

function warriorListener(event) {
    if (addData(event.target.innerHTML)) {
        if (count == 2) {
            pickFromExpert()
        } else if (count == 1) {
            pickFromAll(pc.class)
        } else {
            display.update()
        }

    }


}

function expertListener(event) {
    if (addData(event.target.innerHTML)) {
        if (count == 2) {
            pickFromWarrior()
        } else if (count == 1) {
            pickFromAll(pc.class)
        } else {
            display.update()
        }
    }

}

function allListener(event) {
    if (addData(event.target.innerHTML)) {
        display.update()
    }

}

function addData(fociName) {
    const foci = allFoci.filter(f => f.name == fociName)[0]
    const alreadyContains = pc.foci.filter(f => f == fociName).length > 0
    pc.addFoci(foci.name)
    if (!alreadyContains) {
        const skill = foci.skill
        if (skill.length != 0) {
            handleSkills(skill)
            return false
        }
    }
    count -= 1
    return true
}

function handleSkills(skills) {
    makeSkillsUpdateRequest(pc.skills, skills[0], []).then(text => {
        const furtherSkills = JSON.parse(text);
        if (furtherSkills.followUp.length == 0) {
            pc.addSkill(skills[0])
            count -= 1
            if (count == 2) {
                pickFromWarrior()
            } else if (count == 1) {
                pickFromAll(pc.class)
            } else {
                display.update()
            }
        } else {
            display.clear()
            furtherSkills.followUp.forEach(s => createSkillButton(s.name, skillListener))
        }
    })
}

function fociCompatable(foci, classList) {
    if (classList.filter(s => s.includes("Psychic")).length > 0) {
        if (foci.restriction == "Non Psychic") {
            return false;
        }
    } else {
        if (foci.restriction == "Psychic") {
            return false;
        }
    }
    return true;
}
