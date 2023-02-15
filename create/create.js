import { handleGenerateClickOrigin, handlePresetClickOrigin, handleAllOriginsRequest } from "./handlers/origin.js";
import { addSkillsTooltip, handleSkillsRollButton, handleQuickSkillsButton, handleSkillsPickButton } from "./handlers/skills.js";
import { handleGenerateClickStats, handleClickPickStats, initStatNames } from "./handlers/stats.js";
import { handleAllFociRequest, showFoci } from "./handlers/foci.js";
import { createTippyInstance } from "./tippy/tippy.js";
import { handlePickClass, handlePickAdventurer } from "./handlers/class.js";

function initPreset(user, div) {
  const element = document.createElement("button");
  element.id = user.name.toLowerCase()
  element.className = "unseen"
  div.prepend(element);
  element.innerHTML = user.name;
  element.addEventListener("click", handlePresetClickOrigin);
  let contentList = user.tooltip.replace("'", "&#39;").split(/\n\n/g).filter(s => s).map(s => s.replace(/\n/g, "<br>"))

  const content = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 3fr; grid-gap: 10px; min-width: 700px; max-height: 400px">
  <div style="grid-column: span 3; text-align: center; padding: 12px; font-size: 14px; min-height:150px">${contentList[0]}</div>
  <div style="text-align: center; padding: 12px; font-size: 14px">${contentList[1]} <br><br> ${contentList[2]}</div>
  <div style="text-align: center; padding: 12px; font-size: 14px">${contentList[3]}</div>
  <div style="text-align: center; padding: 12px; font-size: 14px">${contentList[4]}</div>
</div>`
  createTippyInstance(element).setContent(content)
}

initStatNames()
handleAllFociRequest()
const origin = document.getElementById("origin")
handleAllOriginsRequest(origin.parentNode).then(users => {
  users.reverse().forEach(user => {
    initPreset(user, origin.parentNode);
  });
})

document.getElementById("stat-block-generate").addEventListener('click', handleGenerateClickStats);
document.getElementById("stat-block-pick").addEventListener('click', handleClickPickStats);
origin.addEventListener('click', handleGenerateClickOrigin);
const skillsObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "style") {
      if (getComputedStyle(mutation.target).display === "block") {
        addSkillsTooltip(mutation.target)
      }
    }
  });
});
const fociObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "style") {
      if (getComputedStyle(mutation.target).display === "block") {
        showFoci()
      }
    }
  });
});
document.getElementById('skills-quick').addEventListener('click', handleQuickSkillsButton)
document.getElementById('skills-pick').addEventListener('click', handleSkillsPickButton)
document.getElementById('skills-roll').addEventListener('click', handleSkillsRollButton)

document.querySelectorAll(`[id^="skills"]`).forEach(element => {
  skillsObserver.observe(element, { attributes: true });
}
);
fociObserver.observe(document.getElementById('foci'), {attributes: true})

document.querySelectorAll(`[id^="class"]`).forEach(element => {
  element.addEventListener('click', handlePickClass);
}
);
document.getElementById("adventurer").addEventListener('click', handlePickAdventurer)