import { quickSkillsName, setQuickSkills, freeSkillName, setFreeSkill, learningName, setLearning, growthName, setGrowth } from "./skills.js";
import {presetClickRequest, makeUsersRequest, handleGenerateClickRequest } from "./requests/requests.js";
import { getDisplay } from "../display/display.js";

let display = getDisplay()

export function handlePresetClickOrigin(event) {
    process(event, presetClickRequest(event), originToString)
}

export function handleUsersRequest(div) {
    return makeUsersRequest()
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
        setFreeSkill(details);
    } else if (checkName == quickSkillsName) {
        setQuickSkills(details);
    } else if (checkName == growthName) {
        setGrowth(details);
    } else if (checkName == learningName) {
        setLearning(details);
    } else {
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
        let details = ""
        properties.forEach(p => details += handleFunction(p));
        display.replaceText(details)
        display.update()
    })
        .catch(error => {
            console.error('Error fetching data:', error)
        })
}