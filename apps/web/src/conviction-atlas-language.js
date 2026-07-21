/* global document */

const landscape = document.querySelector(".landscape");
if (!landscape) throw new Error("Missing Conviction Atlas landscape.");

const lenses = [
  { id: "evidence", label: "Evidence", copy: "Shows provenance, agreement and contradiction across active inputs." },
  { id: "opportunity", label: "Opportunity", copy: "Highlights routes with the strongest asymmetric upside." },
  { id: "risk", label: "Risk", copy: "Surfaces hazard zones, invalidation points and fragile assumptions." },
  { id: "conviction", label: "Conviction", copy: "Combines evidence quality, challenge pressure and risk-adjusted edge." }
];

const controls = document.createElement("section");
controls.className = "atlas-lenses";
controls.setAttribute("aria-label", "Conviction Atlas lenses");
controls.innerHTML = `
  <div class="lens-buttons">
    ${lenses.map((lens, index) => `<button type="button" data-lens="${lens.id}" aria-pressed="${index === 0}">${lens.label}</button>`).join("")}
  </div>
  <p class="lens-description" aria-live="polite">${lenses[0].copy}</p>
`;
landscape.append(controls);

const riverLayer = document.createElement("div");
riverLayer.className = "signal-rivers";
riverLayer.setAttribute("aria-hidden", "true");
riverLayer.innerHTML = Array.from({ length: 9 }, (_, index) => `<i style="--river:${index}"></i>`).join("");
landscape.append(riverLayer);

const braidLayer = document.createElement("div");
braidLayer.className = "scenario-braid";
braidLayer.setAttribute("aria-hidden", "true");
braidLayer.innerHTML = Array.from({ length: 4 }, (_, index) => `<i style="--braid:${index}"></i>`).join("");
landscape.append(braidLayer);

const buttons = [...controls.querySelectorAll("button")];
const description = controls.querySelector(".lens-description");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const lens = lenses.find((item) => item.id === button.dataset.lens);
    if (!lens) return;
    buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    landscape.dataset.lens = lens.id;
    if (description) description.textContent = lens.copy;
  });
});

landscape.dataset.lens = "evidence";
