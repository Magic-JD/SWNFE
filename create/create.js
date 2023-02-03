import { handleDisplay } from "./display.js";
import { handleGenerateClickStats, handleUsersRequest, handlePresetClickOrigin, handleGenerateClickOrigin, handleSkillsButton, addTooltip } from "./handler.js";
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


const origin = document.getElementById("origin")
handleUsersRequest().then(users => {
  users.reverse().forEach(user => {
    initPreset(user, origin.parentNode);
  });
})
handleDisplay(document.getElementById("title"))
document.getElementById("stat-block").addEventListener('click', handleGenerateClickStats);
origin.addEventListener('click', handleGenerateClickOrigin);
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "style") {
      if (getComputedStyle(mutation.target).display === "block") {
        addTooltip(mutation.target)
      }
    }
  });
});
document.querySelectorAll(`[id^="skills"]`).forEach(element => {
  element.addEventListener('click', handleSkillsButton);
  observer.observe(element, { attributes: true });
}
);
