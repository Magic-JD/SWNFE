import { handleDisplay } from "./display.js";
import { handleGenerateClick, handleUsersRequest, presetClick } from "./handler.js";
import { createTippyInstance } from "./tippy.js";

function initPreset(user, div) {
  const element = document.createElement("button");
  element.id = user.name.toLowerCase()
  element.className = "unseen"
  div.prepend(element);
  element.innerHTML = user.name;
  element.addEventListener("click", presetClick);
  createTippyInstance(element).setContent(user.tooltip.replace(/\n/g, '<br>').replace("'", "&#39;"))
}

document.getElementById("stat-block").addEventListener('click', handleGenerateClick);
handleDisplay(document.getElementById("title"))
document.getElementById("origin").addEventListener('click', handleGenerateClick);

handleUsersRequest().then(users => {
  users.forEach(user => {
    initPreset(user, document.getElementById("origin").parentNode);
  });
})

