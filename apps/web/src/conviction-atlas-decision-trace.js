/* global document, MutationObserver */

const atlas = document.querySelector(".atlas");
const landscape = document.querySelector(".landscape");
const journey = document.querySelector(".decision-journey");

if (!atlas || !landscape || !journey) throw new Error("Missing Conviction Atlas trace targets.");

const stages = [
  { id: "observe", label: "Observe", summary: "Nine raw market inputs enter with source identity preserved.", evidence: "9 active inputs", pressure: "Unfiltered" },
  { id: "correlate", label: "Correlate", summary: "Related signals cluster while disagreements remain visible.", evidence: "6 aligned · 3 mixed", pressure: "Moderate" },
  { id: "thesis", label: "Form thesis", summary: "Four scenario routes are formed from the surviving relationships.", evidence: "4 scenarios", pressure: "Structured" },
  { id: "challenge", label: "Challenge", summary: "Contradictions, invalidation levels and liquidity risks weaken fragile routes.", evidence: "3 challenge tests", pressure: "High" },
  { id: "conviction", label: "Conviction", summary: "The highest risk-adjusted route becomes the recommended path.", evidence: "62% confidence", pressure: "Resolved" },
  { id: "execute", label: "Execute", summary: "The recommendation becomes actionable only with timeframe, sizing and invalidation attached.", evidence: "Conditional long", pressure: "User controlled" }
];

const scenarioCopy = {
  rec: "Recommended path",
  bull: "Bull case",
  side: "Sideways",
  bear: "Bear case"
};

const panel = document.createElement("section");
panel.className = "decision-trace";
panel.setAttribute("aria-labelledby", "decision-trace-title");
panel.innerHTML = `
  <div class="trace-heading">
    <div><p>Explainability layer</p><h2 id="decision-trace-title">Decision trace</h2></div>
    <div class="trace-context" aria-live="polite"><span data-trace-scenario>Recommended path</span><b data-trace-lens>Evidence lens</b></div>
  </div>
  <div class="trace-layout">
    <nav class="trace-steps" aria-label="Decision trace stages">
      ${stages.map((stage, index) => `<button type="button" data-trace-step="${index}" aria-current="${index === 0 ? "step" : "false"}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${stage.label}</strong></button>`).join("")}
    </nav>
    <article class="trace-detail" aria-live="polite" aria-atomic="true">
      <p class="trace-kicker" data-trace-kicker>01 · Observe</p>
      <h3 data-trace-title>Raw evidence enters without losing provenance.</h3>
      <p data-trace-summary>${stages[0].summary}</p>
      <dl><div><dt>Evidence state</dt><dd data-trace-evidence>${stages[0].evidence}</dd></div><div><dt>Challenge pressure</dt><dd data-trace-pressure>${stages[0].pressure}</dd></div><div><dt>Active view</dt><dd data-trace-view>Evidence</dd></div></dl>
    </article>
    <aside class="trace-audit">
      <span>Decision contract</span>
      <ul>
        <li>Evidence identity preserved</li>
        <li>Contradictions remain visible</li>
        <li>Risk changes the recommendation</li>
        <li>Execution remains user controlled</li>
      </ul>
      <p>No scenario is presented as certainty.</p>
    </aside>
  </div>
`;

journey.insertAdjacentElement("afterend", panel);

const stepButtons = [...panel.querySelectorAll("[data-trace-step]")];
const scenarioNode = panel.querySelector("[data-trace-scenario]");
const lensNode = panel.querySelector("[data-trace-lens]");
const kickerNode = panel.querySelector("[data-trace-kicker]");
const titleNode = panel.querySelector("[data-trace-title]");
const summaryNode = panel.querySelector("[data-trace-summary]");
const evidenceNode = panel.querySelector("[data-trace-evidence]");
const pressureNode = panel.querySelector("[data-trace-pressure]");
const viewNode = panel.querySelector("[data-trace-view]");

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectStage(index));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + stepButtons.length) % stepButtons.length;
    stepButtons[next]?.focus();
    selectStage(next);
  });
});

function selectStage(index) {
  const stage = stages[index];
  if (!stage) return;
  stepButtons.forEach((button, buttonIndex) => button.setAttribute("aria-current", buttonIndex === index ? "step" : "false"));
  if (kickerNode) kickerNode.textContent = `${String(index + 1).padStart(2, "0")} · ${stage.label}`;
  if (titleNode) titleNode.textContent = traceTitle(stage.id);
  if (summaryNode) summaryNode.textContent = stage.summary;
  if (evidenceNode) evidenceNode.textContent = stage.evidence;
  if (pressureNode) pressureNode.textContent = stage.pressure;
}

function traceTitle(id) {
  if (id === "observe") return "Raw evidence enters without losing provenance.";
  if (id === "correlate") return "Relationships form without hiding disagreement.";
  if (id === "thesis") return "Possibilities become explicit scenario routes.";
  if (id === "challenge") return "Risk and contradiction remove false confidence.";
  if (id === "conviction") return "One route leads, but uncertainty remains visible.";
  return "The final decision stays with the trader.";
}

function syncContext() {
  const scenario = landscape.dataset.activeScenario || "rec";
  const lens = landscape.dataset.lens || "evidence";
  if (scenarioNode) scenarioNode.textContent = scenarioCopy[scenario] || "Selected scenario";
  if (lensNode) lensNode.textContent = `${lens.charAt(0).toUpperCase()}${lens.slice(1)} lens`;
  if (viewNode) viewNode.textContent = lens.charAt(0).toUpperCase() + lens.slice(1);
}

new MutationObserver(syncContext).observe(landscape, { attributes: true, attributeFilter: ["data-active-scenario", "data-lens"] });
syncContext();
