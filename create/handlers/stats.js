import { process, handleGenerateClickRequest } from "./requests/requests.js";

export function handleGenerateClickStats(event) {
  process(event, handleGenerateClickRequest(event), statsToString)
}

function statsToString(property) {
  return property.name + ": " + property.details.replace(/\n/g, '<br>').replace("'", "&#39;") + '<br>'
}