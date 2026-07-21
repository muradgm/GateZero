import { summarizeEvidence, traderFrameExperience } from "./traderframe-experience-data.js";

/* global document, matchMedia */

const app = document.querySelector("#traderframe-app");

if (!app) throw new Error("Missing TraderFrame mount node.");

const evidence = traderFrameExperience.evidence;
const summary = summarizeEvidence(evidence);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

app.innerHTML = `
  <main class="tf-shell" id="experience">
    <header class="tf-nav">
      <a class="tf-brand" href="./index.html" aria-label="TraderFrame command center">
        <span class="tf-mark" aria-hidden="true"><i></i><i></i></span>
        <span>TraderFrame</span>
      </a>
      <div class="tf-nav-meta">
        <span class="tf-status"><i></i> Evidence gate online</span>
        <button class="tf-control" type="button" aria-pressed="false">Pause flow</button>
      </div>
    </header>

    <section class="tf-hero" aria-labelledby="tf-title">
      <div class="tf-copy">
        <p class="tf-eyebrow">${traderFrameExperience.eyebrow}</p>
        <h1 id="tf-title">Conviction should be <em>earned.</em></h1>
        <p class="tf-lede">${traderFrameExperience.lede}</p>
        <div class="tf-actions">
          <a class="tf-primary" href="#gate">Enter the evidence gate</a>
          <a class="tf-secondary" href="./simulator.html">Open simulator evidence</a>
        </div>
      </div>

      <div class="tf-stage" id="gate" aria-label="Evidence filtering visualization">
        <div class="tf-orbit tf-orbit-a" aria-hidden="true"></div>
        <div class="tf-orbit tf-orbit-b" aria-hidden="true"></div>
        <div class="tf-gate" aria-hidden="true">
          <span class="tf-gate-edge tf-gate-edge-left"></span>
          <span class="tf-gate-core"></span>
          <span class="tf-gate-edge tf-gate-edge-right"></span>
        </div>
        <div class="tf-flow" aria-hidden="true">
          ${evidence.map((item, index) => `<span class="tf-particle tf-${item.state}" style="--i:${index}"></span>`).join("")}
        </div>
        <div class="tf-stage-label tf-stage-label-in"><span>Raw signals</span><strong>${String(summary.total).padStart(2, "0")}</strong></div>
        <div class="tf-stage-label tf-stage-label-out"><span>Verified evidence</span><strong>${String(summary.approved).padStart(2, "0")}</strong></div>
      </div>
    </section>

    <section class="tf-proof" aria-label="Evidence gate summary">
      <article><span>Current thesis</span><strong>${traderFrameExperience.thesis}</strong><small>Confidence adjusted after challenge</small></article>
      <article><span>Evidence accepted</span><strong>${summary.approved} / ${summary.total}</strong><small>${summary.challenged + summary.rejected} signals did not pass cleanly</small></article>
      <article><span>Decision state</span><strong>Reviewable</strong><small>Every claim linked to evidence</small></article>
    </section>

    <section class="tf-workbench" aria-labelledby="workbench-title">
      <div class="tf-section-heading">
        <div><p class="tf-eyebrow">Live decision record</p><h2 id="workbench-title">See what passed. See what did not.</h2></div>
        <p>No hidden score. No black-box confidence. Every signal keeps its status, challenge history and risk weight.</p>
      </div>
      <div class="tf-evidence-list" role="list" aria-label="Evidence records">
        ${evidence.map((item) => `
          <button class="tf-evidence-row" type="button" data-id="${item.id}" aria-expanded="false" role="listitem">
            <span class="tf-evidence-id">${item.id}</span>
            <span class="tf-evidence-name">${item.label}</span>
            <span class="tf-score" aria-label="Evidence score ${item.score} out of 100"><i style="--score:${item.score}%"></i></span>
            <span class="tf-state tf-state-${item.state}">${item.state}</span>
            <span class="tf-chevron" aria-hidden="true">↗</span>
          </button>
        `).join("")}
      </div>
      <aside class="tf-detail" aria-live="polite" aria-atomic="true">
        <p>Select an evidence row to inspect its decision role.</p>
      </aside>
    </section>

    <footer class="tf-footer">
      <span>TraderFrame / Evidence before conviction</span>
      <span>Production shell · reduced-motion ready</span>
    </footer>
  </main>
`;

const shell = document.querySelector(".tf-shell");
const pauseButton = document.querySelector(".tf-control");
const detail = document.querySelector(".tf-detail");
const rows = [...document.querySelectorAll(".tf-evidence-row")];

if (reducedMotion) {
  shell?.classList.add("is-paused");
  pauseButton?.setAttribute("aria-pressed", "true");
  if (pauseButton) pauseButton.textContent = "Resume flow";
}

pauseButton?.addEventListener("click", () => {
  const paused = shell?.classList.toggle("is-paused") ?? false;
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.textContent = paused ? "Resume flow" : "Pause flow";
});

rows.forEach((row, index) => {
  row.addEventListener("click", () => selectEvidence(row));
  row.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    rows[(index + direction + rows.length) % rows.length]?.focus();
  });
});

function selectEvidence(row) {
  const id = row.getAttribute("data-id");
  const item = evidence.find((entry) => entry.id === id);
  if (!item || !detail) return;

  rows.forEach((candidate) => {
    candidate.classList.remove("is-active");
    candidate.setAttribute("aria-expanded", "false");
  });

  row.classList.add("is-active");
  row.setAttribute("aria-expanded", "true");
  detail.innerHTML = `
    <div><span>${item.id} / ${item.state}</span><strong>${item.label}</strong></div>
    <p>${detailCopy(item.state)}</p>
    <dl>
      <div><dt>Evidence score</dt><dd>${item.score}/100</dd></div>
      <div><dt>Gate result</dt><dd>${item.state}</dd></div>
      <div><dt>Source</dt><dd>${item.source}</dd></div>
      <div><dt>Challenge</dt><dd>${item.challenge}</dd></div>
      <div><dt>Risk weight</dt><dd>${item.riskWeight}</dd></div>
    </dl>
  `;
}

function detailCopy(state) {
  if (state === "approved") return "The signal survived source validation, contradiction checks and risk-weight review. It can influence the current thesis.";
  if (state === "challenged") return "The signal remains visible but cannot increase conviction until its contradiction or source-quality issue is resolved.";
  return "The signal failed the evidence threshold and is recorded for traceability, but it is excluded from the active thesis.";
}
