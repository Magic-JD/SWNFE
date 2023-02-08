import { makeAllFociRequests } from "./requests/requests.js";

class Foci {
    constructor(name, restriction, description, level1, level2){
        this.name = name,
        this.restriction = restriction,
        this.description = description,
        this.level1 = level1,
        this.level2 = level2
    }
}

let allFoci = null

export function handleAllFociRequest(){
    makeAllFociRequests().then(text =>{
        const foci = JSON.parse(text).foci
        allFoci = foci.map(foci => {return new Foci(foci.name, foci.restriction, foci.description, foci.level1, foci.level2)})
    })
}