import { quickSkillsName, freeSkillName, learningName, growthName } from "./skills.js";
import { presetOriginRequest, makeAllOriginsRequest, handleGenerateClickRequest } from "./requests/requests.js";
import { getDisplay } from "../display/display.js";
import { getPC } from "../pc/pc.js";

let display = getDisplay()
let pc = getPC()

let origin = {
    name: null,
    shortDescription: null,
    longDescription: null,
    freeSkill: null,
    quickSkills: [],
    growth: [],
    learning: []
}

export function handlePresetClickOrigin(event) {
    process(event, presetOriginRequest(event), originToString)
}

export function handleAllOriginsRequest(div) {
    return makeAllOriginsRequest()
        .then(text => {
            let users = JSON.parse(text).origins;
            return users;
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        })
}

function originToString(property) {
    const checkName = property.name.replace(/\n/g, '').replace(/^\s*[\r\n]/gm, '');
    const details = property.details.replace(/-0/g, '').replace(/^\s*[\r\n]/gm, '');
    if (checkName == freeSkillName) {
        origin.freeSkill = details
    } else if (checkName == quickSkillsName) {
        origin.quickSkills = details.split(/\n/g).filter(s => s)
    } else if (checkName == growthName) {
        origin.growth = details.split(/\n/g).filter(s => s)
    } else if (checkName == learningName) {
        origin.learning = details.split(/\n/g).filter(s => s)
    } else {
        let allWords = property.details.split(',')
        origin.name = allWords.shift()
        origin.shortDescription = allWords.join(',')
        return property.name + ": " + property.details.replace(/\n/g, '<br>').replace(":", '<br>').replace("'", "&#39;") + '<br>' + '<br>'
    }
    return ""
}

export function handleGenerateClickOrigin(event) {
    process(event, handleGenerateClickRequest(event.target.id), originToString)
}

export function process(event, future, handleFunction) {
    future.then(text => {
        let properties = JSON.parse(text).properties;
        properties.forEach(p => handleFunction(p));
        pc.setOrigin(origin)
        display.replaceText("")
        display.update()
    })
        .catch(error => {
            console.error('Error fetching data:', error)
        })
}