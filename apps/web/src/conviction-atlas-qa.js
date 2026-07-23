/* global document, window */

const checks = [
  ["surface", "Production surface mounted", () => Boolean(document.querySelector(".atlas"))],
  ["landscape", "Market landscape mounted", () => Boolean(document.querySelector(".landscape"))],
  ["canvas", "Canvas or static terrain available", () => Boolean(document.querySelector(".atlas-canvas") || document.querySelector(".terrain"))],
  ["scenarios", "Four scenario controls available", () => document.querySelectorAll("[data-scenario]").length === 4],
  ["lenses", "Four decision lenses available", () => document.querySelectorAll("[data-lens]").length === 4],
  ["trace", "Six decision-trace stages available", () => document.querySelectorAll(".decision-trace [data-trace-stage]").length === 6],
  ["quality", "Three experience modes available", () => document.querySelectorAll("[data-quality]").length === 3],
  ["live-region", "Accessible live status available", () => Boolean(document.querySelector("[aria-live]"))],
  ["skip-link", "Keyboard skip link available", () => Boolean(document.querySelector(".skip-link"))],
  ["fallback", "Static SVG fallback available", () => Boolean(document.querySelector("svg.terrain"))]
];

const root = document.querySelector(".atlas");
if (!root) throw new Error("Missing Conviction Atlas QA target.");

const panel = document.createElement("section");
panel.className = "qa-panel";
panel.setAttribute("aria-label", "Conviction Atlas quality assurance results");
panel.innerHTML = `
  <div class="qa-panel-heading">
    <div><span>Milestone 7</span><strong>Runtime QA</strong></div>
    <button type="button" data-qa-run>Run checks</button>
  </div>
  <div class="qa-summary" aria-live="polite"><b data-qa-score>Not run</b><span data-qa-status>Browser validation pending</span></div>
  <div class="qa-results" role="list"></div>
`;
root.append(panel);

const results = panel.querySelector(".qa-results");
const score = panel.querySelector("[data-qa-score]");
const status = panel.querySelector("[data-qa-status]");
const runButton = panel.querySelector("[data-qa-run]");

runButton?.addEventListener("click", runChecks);
window.addEventListener("load", () => window.setTimeout(runChecks, 80), { once: true });

function runChecks() {
  const evaluated = checks.map(([id, label, assertion]) => {
    try {
      return { id, label, passed: Boolean(assertion()) };
    } catch (error) {
      return { id, label, passed: false, error: error instanceof Error ? error.message : String(error) };
    }
  });

  const passed = evaluated.filter((item) => item.passed).length;
  const complete = passed === evaluated.length;
  if (score) score.textContent = `${passed}/${evaluated.length}`;
  if (status) status.textContent = complete ? "All structural runtime checks passed" : `${evaluated.length - passed} checks require attention`;
  panel.dataset.qaState = complete ? "passed" : "failed";
  if (results) {
    results.innerHTML = evaluated.map((item) => `
      <article role="listitem" class="${item.passed ? "passed" : "failed"}">
        <i aria-hidden="true">${item.passed ? "✓" : "!"}</i>
        <span><strong>${item.label}</strong>${item.error ? `<small>${item.error}</small>` : ""}</span>
      </article>
    `).join("");
  }

  window.dispatchEvent(new CustomEvent("conviction-atlas:qa", { detail: { passed, total: evaluated.length, results: evaluated } }));
}
