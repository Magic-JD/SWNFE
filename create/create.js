import { handleDisplay } from "./display.js";
import { handleGenerateClick, getTooltip, presetClick } from "./handler.js";
import { createTippyInstance } from "./tippy.js";

function initPreset(element){
  const id = element.id
  element.innerHTML = id.charAt(0).toUpperCase() + id.slice(1)
  element.addEventListener('click', presetClick);
  getTooltip(createTippyInstance(element), element.id)
}

document.getElementById("stat-block").addEventListener('click', handleGenerateClick);
document.getElementById("origin").addEventListener('click', handleGenerateClick);
initPreset(document.getElementById("barbarian"))
initPreset(document.getElementById("clergy"))
initPreset(document.getElementById("courtesan"))
initPreset(document.getElementById("criminal"))
initPreset(document.getElementById("dilettante"))
initPreset(document.getElementById("entertainer"))
initPreset(document.getElementById("merchant"))
initPreset(document.getElementById("noble"))
initPreset(document.getElementById("official"))
initPreset(document.getElementById("peasant"))
initPreset(document.getElementById("physician"))
initPreset(document.getElementById("pilot"))
initPreset(document.getElementById("politician"))
initPreset(document.getElementById("scholar"))
initPreset(document.getElementById("soldier"))
initPreset(document.getElementById("spacer"))
initPreset(document.getElementById("technician"))
initPreset(document.getElementById("thug"))
initPreset(document.getElementById("vagabond"))
initPreset(document.getElementById("worker"))
handleDisplay(document.getElementById("title"))