/* global document, fetch */

const response = await fetch("./src/simulator-workspace-data.json", { cache: "no-store" });

if (!response.ok) {
  throw new Error("Local simulator workspace data is unavailable.");
}

const data = await response.json();
const root = document.querySelector("#simulator-workspace");

if (!root) {
  throw new Error("Missing simulator workspace root.");
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });
const percent = (value) => `${number.format(value * 100)}%`;
const statusLabel = (value) => value.replaceAll("_", " ");

root.innerHTML = `
  <div class="sim-shell">
    <header class="sim-header">
      <div class="brand-lockup">
        <span class="brand-name">TraderFrame</span>
        <span class="brand-control">Controlled by GateZero</span>
      </div>
      <a class="back-link" href="./#workspace">Back to Command Center</a>
    </header>
    <main>
      <section class="sim-intro" aria-labelledby="sim-title">
        <div>
          <p class="eyebrow">Read-only local evidence</p>
          <h1 id="sim-title">${data.title}</h1>
          <p class="intro-copy">${data.subtitle}</p>
        </div>
        <div class="scope-lockup" aria-label="Operating boundary">
          <span>${data.gate}</span>
          <strong>Scenario inspection</strong>
          <small>${data.scope}</small>
        </div>
      </section>
      <section class="case-selector-band" aria-labelledby="case-selector-title">
        <div>
          <p class="eyebrow">Local research inventory</p>
          <h2 id="case-selector-title">Research cases</h2>
          <p>Switch checked-in case evidence. Selection does not record or approve a decision.</p>
        </div>
        <div class="case-selector" role="group" aria-label="Research case">
          ${data.researchCases
            .map(
              (item) =>
                `<button type="button" data-case="${item.inventoryId}" aria-pressed="${item.inventoryId === data.caseWorkspace.defaultCaseInventoryId}">${item.label}</button>`
            )
            .join("")}
        </div>
       </section>
       <section class="catalog-band" aria-labelledby="catalog-title">
         <header>
           <div><p class="eyebrow">Checked-in intake</p><h2 id="catalog-title">Local case catalog</h2></div>
           <span>${data.caseCatalog.items.length} record</span>
         </header>
         ${data.caseCatalog.items
           .map(
             (item) => `<article>
               <div><strong>${item.title}</strong><code>${item.case_id}</code></div>
               <dl>
                 <div><dt>Status</dt><dd>${statusLabel(item.status)}</dd></div>
                 <div><dt>Freshness</dt><dd>${statusLabel(item.freshness_status)}</dd></div>
                 <div><dt>Evidence</dt><dd>${item.evidence_count}</dd></div>
               </dl>
               <details><summary>Checked-in sources</summary><ul>${item.source_refs.map((source) => `<li><code>${source}</code></li>`).join("")}</ul><p>${item.limitation_notes.join(" ")}</p></details>
             </article>`
           )
           .join("")}
       </section>
       <section class="intake-diagnostics" aria-labelledby="intake-diagnostics-title">
         <header>
           <div><p class="eyebrow">Local validation</p><h2 id="intake-diagnostics-title">Intake diagnostics</h2></div>
           <span>${data.caseIntakeDiagnostics.accepted_count} accepted / ${data.caseIntakeDiagnostics.rejected_count} rejected</span>
         </header>
         <p class="diagnostic-boundary"><code>${data.caseIntakeDiagnostics.intake_directory}</code> is the only scanned directory.</p>
         <ul>
           ${data.caseIntakeDiagnostics.files
             .map(
               (file) => `<li class="${file.status}">
                 <div><strong>${statusLabel(file.status)}</strong><code>${file.source_file}</code></div>
                 <span>${file.error_code ? statusLabel(file.error_code) : file.case_id}</span>
                 <p>${file.message}</p>
               </li>`
             )
             .join("")}
         </ul>
       </section>
       <div id="case-workspace-view" aria-live="polite"></div>
      <section class="scenario-toolbar" aria-labelledby="scenario-title">
        <div>
          <p class="eyebrow" id="scenario-title">Evidence scenario</p>
          <p class="scenario-help">Select a recorded fixture to inspect. Selection does not run or change a simulation.</p>
        </div>
        <div class="scenario-selector" role="group" aria-label="Evidence scenario">
          ${data.scenarios
            .map(
              (scenario) =>
                `<button type="button" data-scenario="${scenario.key}" aria-pressed="${scenario.key === data.defaultScenario}">${scenario.label}</button>`
            )
            .join("")}
        </div>
      </section>
      <section class="risk-comparison" aria-labelledby="risk-comparison-title">
        <header>
          <div>
            <p class="eyebrow">Evidence comparison</p>
            <h2 id="risk-comparison-title">Clear and blocked risk states</h2>
          </div>
          <span>No score or promotion</span>
        </header>
        <div class="comparison-table-wrap">
          <table>
            <thead><tr><th>Scenario</th><th>Risk state</th><th>Drawdown</th><th>Mutation</th><th>Reason</th></tr></thead>
            <tbody>${data.riskComparison
              .map(
                (item) => `<tr>
                  <td data-label="Scenario">${item.scenarioLabel}</td>
                  <td data-label="Risk state">${statusLabel(item.riskStatus)}</td>
                  <td data-label="Drawdown">${percent(item.drawdownFraction)} / ${percent(item.maxDrawdownFraction)}</td>
                  <td data-label="Mutation">${item.stateChanged ? "Recorded" : "Blocked"}</td>
                  <td data-label="Reason">${evidenceReasons(item.blockingReasons)}</td>
                </tr>`
              )
              .join("")}</tbody>
          </table>
        </div>
      </section>
      <div id="scenario-view" aria-live="polite"></div>
    </main>
  </div>
`;

const scenarioView = document.querySelector("#scenario-view");
const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];
const caseWorkspaceView = document.querySelector("#case-workspace-view");
const caseButtons = [...document.querySelectorAll("[data-case]")];

if (!scenarioView || !caseWorkspaceView) {
  throw new Error("Missing local evidence workspace view.");
}

renderResearchCase(data.caseWorkspace.defaultCaseInventoryId);
renderScenario(data.defaultScenario);

for (const button of caseButtons) {
  button.addEventListener("click", () => {
    for (const candidate of caseButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    const researchCase = renderResearchCase(button.dataset.case);
    selectScenario(researchCase.linkedScenarioKey);
  });
}

for (const button of scenarioButtons) {
  button.addEventListener("click", () => {
    for (const candidate of scenarioButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    renderScenario(button.dataset.scenario);
  });
}

function renderResearchCase(inventoryId) {
  const researchCase = data.researchCases.find((item) => item.inventoryId === inventoryId);

  if (!researchCase) {
    throw new Error(`Unknown local research case: ${inventoryId}`);
  }

  const blocked = researchCase.completeness === "blocked";
  caseWorkspaceView.innerHTML = `
    <section class="case-handoff ${blocked ? "blocked" : "complete"}" aria-labelledby="case-handoff-title">
      <header>
        <div>
          <p class="eyebrow">Strategy-to-simulator handoff</p>
          <h2 id="case-handoff-title">Research case ${researchCase.id}</h2>
          <p>${blocked ? "Missing or stale evidence keeps this case blocked." : "Reviewed strategy evidence and local simulation records are linked for inspection."}</p>
        </div>
        <span>${statusLabel(researchCase.completeness)}</span>
      </header>
      <div class="case-state-strip" aria-label="Case evidence state">
        ${metric("Completeness", statusLabel(researchCase.completeness), statusLabel(researchCase.status))}
        ${metric("Freshness", statusLabel(researchCase.freshness), "Per-case evidence")}
        ${metric("Manual review", statusLabel(researchCase.operatorReviewStatus), researchCase.operatorRequired ? "Operator required" : "Review missing")}
        ${metric("Missing records", String(researchCase.missingEvidence.length), evidenceReasons(researchCase.missingEvidence))}
      </div>
      <dl class="case-link-grid">
        ${caseLink("Handoff", researchCase.handoffId)}
        ${caseLink("Strategy idea", researchCase.strategyIdeaId)}
        ${caseLink("Simulation detail", researchCase.simulationEvidenceDetailId)}
        ${caseLink("Simulation record", researchCase.simulatedOrderRecordId)}
        ${caseLink("Risk review", researchCase.riskReviewId)}
      </dl>
      <div class="case-support-grid">
        ${supportPanel(
          "Case provenance",
          `<ul>${researchCase.provenanceRefs.map((item) => `<li><code>${item}</code></li>`).join("")}</ul>`
        )}
        ${supportPanel(
          "Operator review checklist",
          `<ol>${researchCase.operatorChecklist.map((item) => `<li>${item}</li>`).join("")}</ol>`
        )}
        ${supportPanel(
          "Manual operator note",
          researchCase.operatorNote
            ? `<strong>${researchCase.operatorNote.id}</strong><p>${researchCase.operatorNote.body}</p><small>${researchCase.operatorNote.limitationNotes.join(" ")}</small>`
            : `<p class="missing-record">No local operator note recorded.</p>`
        )}
        ${supportPanel("Outcome and learning", linkedOutcomeAndLearning(researchCase))}
      </div>
      <div class="handoff-limitations" role="note">
        <strong>Case limitations</strong>
        <span>${researchCase.limitationNotes.join(" ")}</span>
      </div>
    </section>
  `;

  return researchCase;
}

function linkedOutcomeAndLearning(researchCase) {
  return `<dl class="linked-records">
    <div><dt>Outcome</dt><dd>${researchCase.outcome ? `<code>${researchCase.outcome.id}</code><small>${researchCase.outcome.limitation}</small>` : '<span class="missing-record">Not recorded</span>'}</dd></div>
    <div><dt>Learning</dt><dd>${researchCase.learning ? `<code>${researchCase.learning.id}</code><small>${researchCase.learning.limitation}</small>` : '<span class="missing-record">Not recorded</span>'}</dd></div>
  </dl>`;
}

function selectScenario(key) {
  for (const button of scenarioButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.scenario === key));
  }
  renderScenario(key);
}

function renderScenario(key) {
  const scenario = data.scenarios.find((candidate) => candidate.key === key);

  if (!scenario) {
    throw new Error(`Unknown simulator evidence scenario: ${key}`);
  }

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: scenario.account.currency,
    maximumFractionDigits: 2
  });
  const blocked = scenario.blockingReasons.length > 0;

  scenarioView.innerHTML = `
    <section class="scenario-status ${blocked ? "blocked" : "recorded"}" aria-labelledby="active-scenario-title">
      <div>
        <p class="eyebrow">Active evidence record</p>
        <h2 id="active-scenario-title">${scenario.label}</h2>
        <p>${scenario.summary}</p>
      </div>
      <strong>${statusLabel(scenario.status)}</strong>
    </section>
    ${
      blocked
        ? `<section class="blocking-banner" role="status"><strong>State mutation blocked</strong><ul>${scenario.blockingReasons.map((reason) => `<li>${statusLabel(reason)}</li>`).join("")}</ul></section>`
        : `<section class="clear-banner" role="status"><strong>Recorded evidence</strong><span>The local reducer accepted this fixture and preserved its journal chain.</span></section>`
    }
    <section class="evidence-strip" aria-label="Account evidence summary">
      ${metric("Cash", money.format(scenario.account.cashAfter), `Before ${money.format(scenario.account.cashBefore)}`)}
      ${metric("Equity", money.format(scenario.account.equityAfter), `Before ${money.format(scenario.account.equityBefore)}`)}
      ${metric("State changed", scenario.account.stateChanged ? "Yes" : "No", statusLabel(scenario.status))}
      ${metric("Journal events", String(scenario.journal.eventCount), scenario.journal.immutable ? "Immutable" : "Review required")}
    </section>
    <div class="evidence-grid">
      ${panel(
        "Position and equity",
        "Deterministic accounting",
        rows([
          ["Instrument", scenario.position.instrument],
          [
            "Quantity",
            `${number.format(scenario.position.quantityBefore)} → ${number.format(scenario.position.quantityAfter)}`
          ],
          [
            "Average price",
            `${number.format(scenario.position.averagePriceBefore)} → ${number.format(scenario.position.averagePriceAfter)}`
          ],
          ["Mark price", number.format(scenario.position.markPrice)],
          ["Marked value", money.format(scenario.position.markedValue)],
          ["Fee-adjusted P&L", money.format(scenario.account.feeAdjustedPnl)]
        ])
      )}
      ${panel(
        "Lifecycle evidence",
        "Manual transition",
        `<ol class="timeline">
          <li><span>From</span><strong>${statusLabel(scenario.lifecycle.from)}</strong></li>
          <li><span>Operator review</span><strong>${scenario.lifecycle.operatorRequired ? "Required" : "Missing"}</strong></li>
          <li><span>To</span><strong>${statusLabel(scenario.lifecycle.to)}</strong></li>
        </ol><p class="panel-note">${scenario.lifecycle.reason}</p>`
      )}
      ${panel(
        "Risk and candidate guards",
        scenario.risk.policyLocked ? "Policy locked" : "Policy review required",
        rows([
          ["Risk evaluation", statusLabel(scenario.risk.status)],
          ["Risk reasons", evidenceReasons(scenario.risk.breaches)],
          ["Candidate integrity", statusLabel(scenario.candidate.status)],
          ["Candidate reasons", evidenceReasons(scenario.candidate.reasons)],
          [
            "Position fraction",
            `${percent(scenario.risk.positionFraction)} / ${percent(scenario.risk.maxPositionFraction)}`
          ],
          [
            "Drawdown fraction",
            `${percent(scenario.risk.drawdownFraction)} / ${percent(scenario.risk.maxDrawdownFraction)}`
          ],
          ["Policy version", scenario.risk.policyVersion],
          ["Candidate age limit", `${scenario.candidate.maxAgeSeconds}s`]
        ])
      )}
      ${panel(
        "Fill-cost evidence",
        "Synthetic assumptions",
        rows([
          ["Side / quantity", `${scenario.fill.side} / ${number.format(scenario.fill.quantity)}`],
          ["Fill price", number.format(scenario.fill.price)],
          ["Notional", money.format(scenario.fill.notional)],
          ["Fee", money.format(scenario.fill.fee)],
          ["Spread / slippage", `${scenario.fill.spreadBps} / ${scenario.fill.slippageBps} bps`],
          ["Modeled latency", `${scenario.fill.latencyMs} ms`]
        ]) + `<p class="panel-note warning">${scenario.fill.limitation}</p>`
      )}
      ${panel(
        "Journal chain evidence",
        scenario.journal.immutable ? "Immutable" : "Integrity review required",
        scenario.journal.events.length > 0
          ? `<ol class="journal-list">${scenario.journal.events
              .map(
                (
                  event
                ) => `<li><strong>#${event.sequence} ${statusLabel(event.type)}</strong><dl class="evidence-rows">
                  <div><dt>Previous hash</dt><dd><code>${event.previousHash ?? "chain origin"}</code></dd></div>
                  <div><dt>Event hash</dt><dd><code>${event.eventHash}</code></dd></div>
                </dl></li>`
              )
              .join("")}</ol>`
          : `<p class="panel-note">No journal event was appended because the reducer did not mutate local state.</p>`
      )}
      ${panel(
        "Reconciliation evidence",
        scenario.reconciliation.readonlyEmergency ? "Readonly emergency" : "Reconciled",
        rows([
          ["Status", statusLabel(scenario.reconciliation.status)],
          ["Mismatch reasons", evidenceReasons(scenario.reconciliation.mismatchReasons)],
          [
            "Readonly emergency",
            scenario.reconciliation.readonlyEmergency ? "Required" : "Not required"
          ],
          [
            "Tail hash",
            scenario.journal.tailHash
              ? `<code>${scenario.journal.tailHash}</code>`
              : "No new tail hash"
          ]
        ])
      )}
      ${panel(
        "Operating boundary",
        "Inspection only",
        `<ul class="boundary-list">${data.boundaries.map((item) => `<li>${item}</li>`).join("")}</ul>`
      )}
    </div>
    <footer>
      <span>Record ${scenario.account.id}</span>
      <span>Generated ${new Date(scenario.reducedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</span>
    </footer>
  `;
}

function evidenceReasons(items) {
  return items.length > 0 ? items.map(statusLabel).join(", ") : "None recorded";
}

function caseLink(label, value) {
  return `<div><dt>${label}</dt><dd>${value ? `<code>${value}</code>` : '<span class="missing-record">Not recorded</span>'}</dd></div>`;
}

function supportPanel(title, content) {
  return `<section><h3>${title}</h3>${content}</section>`;
}

function metric(label, value, detail) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`;
}

function panel(title, chip, content) {
  return `<section class="evidence-panel"><header><h2>${title}</h2><span>${chip}</span></header>${content}</section>`;
}

function rows(items) {
  return `<dl class="evidence-rows">${items
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("")}</dl>`;
}
