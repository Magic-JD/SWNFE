import { setDoc } from "../../display/display.js";

export function handleGenerateClickRequest(endpoint) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/${endpoint}`);
}

export function presetClickRequest(event) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/origin/${event.target.id}`);
}

export function makeUsersRequest() {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/origin/all`);
}

export function makeRollOnTableRequest(chosen, requestName, tableData) {
    return fetch(`https://swn-generate.herokuapp.com/create/pc/skills/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chosen: chosen,
            name: requestName,
            table: tableData
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.text()
        })
}

export function makeSkillsUpdateRequest(chosen, pending, available) {
    return fetch(`https://swn-generate.herokuapp.com/create/pc/skills/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chosen: chosen,
            pending: pending,
            available: available
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.text()
        })
}


function handleClickRequest(url) {
    return fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.text()
        })
}

export function process(event, future, handleFunction) {
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