export function handleDisplay(display) {
    shutdown(display)
    let next = display.nextElementSibling
    if (next != null) {
        activate(next)
    }
}

export function shutdown(display) {
    display.style.display = "flex"
    display.childNodes.forEach(child => {
        if (child.nodeName.includes("BUTTON")) {
            child.style.display = "none";
        }
    });
}

function activate(display) {
    display.childNodes.forEach(child => {
        if (child.nodeName.includes("BUTTON")) {
            child.style.display = "block";
        }
    });
}