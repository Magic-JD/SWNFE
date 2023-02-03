export function handleGenerateClickRequest(event) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/${event.target.id}`);
}

export function presetClickRequest(event) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/origin/${event.target.id}`);
}

export function getTooltipRequest(url) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/tooltip/origin/${url}`);
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