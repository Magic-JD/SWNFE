import { getDisplay } from "../display/display.js";

let display = getDisplay()
let count = 0;

export function handlePickClass(event) {
  display.addText(event.target.innerHTML)
  display.update()
}

export function handlePickAdventurer(event){
    display.addText(event.target.innerHTML)
    display.clear()
    display.div.append(createPartialClassButton("partial-warrior", "Partial Warrior"))
    display.div.append(createPartialClassButton("partial-expert", "Partial Expert"))
    display.div.append(createPartialClassButton("partial-psychic", "Partial Psychic"))
}

function createPartialClassButton(id, details) {
    const element = document.createElement("button");
    element.id = id
    element.innerHTML = details
    element.addEventListener("click", createPartialClassListener);
    return element
  }

  function createPartialClassListener(event){
    count += 1
    const element = event.target
    display.addText(`<br>${element.innerHTML}`)
    element.style.display = "none"
    if(count == 2){
        display.update()
    }
  }