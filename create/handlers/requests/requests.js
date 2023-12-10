
export function handleGenerateClickRequest(endpoint) {
    return handleClickRequest(`https://swn.onrender.com/create/pc/${endpoint}`);
}

export function presetOriginRequest(event) {
    return handleClickRequest(`https://swn.onrender.com/create/pc/origin/${event.target.id}`);
}

export function makeAllOriginsRequest() {
    return handleClickRequest(`https://swn.onrender.com/create/pc/origin/all`);
}

export function makeAllFociRequest(){
    return handleClickRequest(`https://swn.onrender.com/create/pc/foci/all`);
}

export function makeRollOnTableRequest(chosen, requestName, tableData) {
    return fetch(`https://swn.onrender.com/create/pc/skills/generate`, {
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
    return fetch(`https://swn.onrender.com/create/pc/skills/update`, {
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
