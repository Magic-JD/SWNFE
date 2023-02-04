import { setDoc } from "../../display/display.js";

export function handleGenerateClickRequest(event) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/${event.target.id}`);
}

export function presetClickRequest(event) {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/origin/${event.target.id}`);
}

export function makeUsersRequest() {
    return handleClickRequest(`https://swn-generate.herokuapp.com/create/pc/origin/all`);
}

export function makeRollOnTableRequest(requestName, tableData){
    return fetch(`https://swn-generate.herokuapp.com/roll/table`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: requestName,
          tableValues: tableData
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