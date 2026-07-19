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
      <div id="scenario-view" aria-live="polite"></div>
    </main>
  </div>
`;

const scenarioView = document.querySelector("#scenario-view");
const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];

if (!scenarioView) {
  throw new Error("Missing scenario evidence view.");
}

renderScenario(data.defaultScenario);

for (const button of scenarioButtons) {
  button.addEventListener("click", () => {
    for (const candidate of scenarioButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    renderScenario(button.dataset.scenario);
  });
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
