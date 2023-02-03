import { handleDisplay } from "./display.js";
import { handleGenerateClickStats, handleUsersRequest, handlePresetClickOrigin, handleGenerateClickOrigin, handleSkillsButton } from "./handler.js";
import { createTippyInstance } from "./tippy.js";

function initPreset(user, div) {
  const element = document.createElement("button");
  element.id = user.name.toLowerCase()
  element.className = "unseen"
  div.prepend(element);
  element.innerHTML = user.name;
  element.addEventListener("click", handlePresetClickOrigin);
  createTippyInstance(element).setContent(user.tooltip.replace(/\n/g, '<br>').replace("'", "&#39;"))
}

document.getElementById("stat-block").addEventListener('click', handleGenerateClickStats);
handleDisplay(document.getElementById("title"))
document.getElementById("origin").addEventListener('click', handleGenerateClickOrigin);
handleUsersRequest().then(users => {
  users.forEach(user => {
    initPreset(user, document.getElementById("origin").parentNode);
  });
})
document.getElementById("origin").addEventListener('click', handleGenerateClickOrigin);
document.querySelectorAll(`[id^="skills"]`).forEach(element => element.addEventListener('click', handleSkillsButton));
