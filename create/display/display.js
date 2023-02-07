export class Display {
    constructor(div) {
        this.div = div;
        this.clear = function () { shutdown(this.div); };
        this.show = function () { activate(this.div) }
        this.update = function () { handleDisplay(this.div, this); };
        this.addText = function (string) { this.infoElement.innerHTML += string };
        this.replaceText = function (string) { this.infoElement.innerHTML = string; };
        this.retrieveText = function () { return this.infoElement.innerHTML; };
        this.infoElement = createInfoElement(this.div);
        this.setToGrid = function () { setToGrid(this.div); };
        this.setDiv = function (div) {
            this.div = div
            this.infoElement = createInfoElement(div)
        }
    }
}
function createInfoElement(div) {
    const element = document.createElement("div");
    element.style.clear = "both";
    element.style.display = "flex";
    element.style.justifyContent = "center";
    div.insertAdjacentElement("beforebegin", element);
    return element
}


function handleDisplay(div, display) {
    display.replaceText(display.retrieveText().split("<br>").filter(s => {return s != ""}).join("<br>"))
    shutdown(div)
    let next = div.nextElementSibling
    if (next != null) {
        activate(next)
    }
    div.parentNode.removeChild(display.infoElement)
    display.setDiv(next);
    div.parentNode.removeChild(div)
    
}

function shutdown(div) {
    div.childNodes.forEach(child => {
        if (child.nodeName.includes("BUTTON")) {
            child.style.display = "none";
        }
    });
}

function activate(div) {
    div.childNodes.forEach(child => {
        if (child.nodeName.includes("BUTTON")) {
            child.style.display = "block";
        }
    });
}

function setToGrid(div) {
    div.style.display = "grid"
    div.style.gridTemplateColumns = "repeat(4, 1fr)"
    div.style.gridGap = "16px"
}

let display = new Display(document.getElementById("pc-display").nextElementSibling);
display.show()


export function getDisplay() {
    return display
}
