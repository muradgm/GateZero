/* global document, matchMedia */

const landscape = document.querySelector(".landscape");
const journeyCards = [...document.querySelectorAll(".journey-grid article")];

if (!landscape) throw new Error("Missing Conviction Atlas landscape for cinematic polish.");

const cinematicLayer = document.createElement("div");
cinematicLayer.className = "cinematic-layer";
cinematicLayer.setAttribute("aria-hidden", "true");
cinematicLayer.innerHTML = `
  <i class="regional-light regional-light-evidence"></i>
  <i class="regional-light regional-light-bull"></i>
  <i class="regional-light regional-light-side"></i>
  <i class="regional-light regional-light-bear"></i>
  <i class="regional-light regional-light-conviction"></i>
  <i class="cinematic-vignette"></i>
  <span class="risk-pulse risk-pulse-a"></span>
  <span class="risk-pulse risk-pulse-b"></span>
  <span class="route-emphasis"></span>
`;
landscape.append(cinematicLayer);

const scenes = [
  {
    id: "observe",
    label: "Chaotic market signals entering from independent sources",
    markup: `<span class="signal-cloud">${Array.from({ length: 22 }, (_, index) => `<i style="--p:${index}"></i>`).join("")}</span>`
  },
  {
    id: "correlate",
    label: "Signals forming connected contour relationships",
    markup: `<span class="contour-cluster">${Array.from({ length: 8 }, (_, index) => `<i style="--p:${index}"></i>`).join("")}</span>`
  },
  {
    id: "thesis",
    label: "Three scenario paths branching from a shared thesis",
    markup: `<span class="branch-scene"><i></i><i></i><i></i><b></b></span>`
  },
  {
    id: "challenge",
    label: "Scenario paths under contradiction and risk pressure",
    markup: `<span class="challenge-scene"><i></i><i></i><b></b><b></b></span>`
  },
  {
    id: "conviction",
    label: "One dominant route surviving challenge pressure",
    markup: `<span class="conviction-scene"><i></i><b></b>${Array.from({ length: 6 }, (_, index) => `<em style="--p:${index}"></em>`).join("")}</span>`
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
});

const observer = new MutationObserver(() => {
  cinematicLayer.dataset.scenario = landscape.dataset.activeScenario || "rec";
  cinematicLayer.dataset.lens = landscape.dataset.lens || "evidence";
});

observer.observe(landscape, { attributes: true, attributeFilter: ["data-active-scenario", "data-lens", "data-quality", "data-renderer"] });
cinematicLayer.dataset.scenario = landscape.dataset.activeScenario || "rec";
cinematicLayer.dataset.lens = landscape.dataset.lens || "evidence";

if (matchMedia("(prefers-reduced-motion: reduce)").matches) cinematicLayer.classList.add("reduced-motion");
