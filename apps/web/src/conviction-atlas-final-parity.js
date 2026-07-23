/* global document */

const landscape = document.querySelector(".landscape");
const journeyCards = [...document.querySelectorAll(".journey-grid article")];

if (!landscape) throw new Error("Missing Conviction Atlas landscape for final parity pass.");

const parity = document.createElement("div");
parity.className = "final-parity-layer";
parity.setAttribute("aria-hidden", "true");
parity.innerHTML = `
  <div class="parity-depth parity-depth-back"></div>
  <div class="parity-depth parity-depth-mid"></div>
  <div class="parity-convergence"><i></i><i></i><i></i><b></b></div>
  <div class="parity-route parity-route-permanent">
    ${Array.from({ length: 9 }, (_, index) => `<i style="--node:${index}"></i>`).join("")}
  </div>
  <div class="parity-region parity-region-bull"></div>
  <div class="parity-region parity-region-side"></div>
  <div class="parity-region parity-region-bear"></div>
  <div class="parity-region parity-region-rec"></div>
`;
landscape.append(parity);

const labels = {
  bull: "Bull scenario selected. Recommended route remains visible for comparison.",
  side: "Sideways scenario selected. Recommended route remains visible for comparison.",
  bear: "Bear scenario selected. Recommended route remains visible for comparison.",
  rec: "Recommended path selected. Full route priority enabled."
};

const announce = document.createElement("span");
announce.className = "sr-only";
announce.setAttribute("aria-live", "polite");
landscape.append(announce);

function sync() {
  const scenario = landscape.dataset.activeScenario || "rec";
  const lens = landscape.dataset.lens || "evidence";
  parity.dataset.scenario = scenario;
  parity.dataset.lens = lens;
  announce.textContent = labels[scenario] || labels.rec;
}

new MutationObserver(sync).observe(landscape, {
  attributes: true,
  attributeFilter: ["data-active-scenario", "data-lens", "data-renderer", "data-quality"]
});
sync();

journeyCards.forEach((card, index) => {
  card.style.setProperty("--journey-index", index);
  card.dataset.parityStage = ["observe", "correlate", "thesis", "challenge", "conviction", "execute"][index] || "stage";
});
