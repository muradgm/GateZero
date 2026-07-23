/* global document */

const journeyCards = [...document.querySelectorAll(".journey-grid article")];

const scenes = [
  {
    id: "observe",
    label: "Chaotic market signals entering from independent sources",
    markup: `<span class="signal-cloud">${Array.from({ length: 28 }, (_, index) => `<i style="--p:${index}"></i>`).join("")}</span>`
  },
  {
    id: "correlate",
    label: "Signals forming connected contour relationships",
    markup: `<span class="contour-cluster">${Array.from({ length: 10 }, (_, index) => `<i style="--p:${index}"></i>`).join("")}</span>`
  },
  {
    id: "thesis",
    label: "Three scenario paths branching from a shared thesis",
    markup: `<span class="branch-scene"><i></i><i></i><i></i><b></b></span>`
  },
  {
    id: "challenge",
    label: "Scenario paths under contradiction and risk pressure",
    markup: `<span class="challenge-scene"><i></i><i></i><b></b><b></b><em></em></span>`
  },
  {
    id: "conviction",
    label: "One dominant route surviving challenge pressure",
    markup: `<span class="conviction-scene"><i></i><b></b>${Array.from({ length: 8 }, (_, index) => `<em style="--p:${index}"></em>`).join("")}</span>`
  },
  {
    id: "execute",
    label: "The selected route folding into an execution workspace",
    markup: `<span class="execute-scene"><i></i><i></i><b></b></span>`
  }
];

journeyCards.forEach((card, index) => {
  const scene = scenes[index];
  const miniMap = card.querySelector(".mini-map");
  if (!scene || !miniMap) return;
  miniMap.className = `mini-map journey-scene journey-scene-${scene.id}`;
  miniMap.setAttribute("role", "img");
  miniMap.setAttribute("aria-label", scene.label);
  miniMap.innerHTML = scene.markup;
  card.dataset.journeyStage = scene.id;
});
