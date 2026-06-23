import { commandCenterData } from "./command-center-data.js";

/* global document, fetch, setInterval, window */

const app = document.querySelector("#app");
const runtimeDataUrl = "/runtime/command-center-data.json";
const runtimeRefreshMs = 15_000;

if (!app) {
  throw new Error("Missing command center mount node.");
}

renderCommandCenter(commandCenterData);
void refreshRuntimeData();
setInterval(() => {
  void refreshRuntimeData();
}, runtimeRefreshMs);

function renderCommandCenter(data) {
  app.innerHTML = `
  <div class="shell">
    <aside class="sidebar" aria-label="Command center navigation">
      <div class="brand">
        <div class="brand-mark">TF</div>
        <div>
          <div class="brand-name">${data.project}</div>
          <div class="brand-subtitle">Command Center</div>
        </div>
      </div>
      <nav class="nav-list" aria-label="Primary sections">
        ${data.navItems
          .map(
            (item, index) =>
              `<a class="${index === 0 ? "active" : ""}" href="#${slug(item)}" data-section="${slug(
                item
              )}">${item}</a>`
          )
          .join("")}
      </nav>
      <div class="rail-note">
        <span class="note-label">Operating scope</span>
        <strong>${data.scope}</strong>
      </div>
    </aside>

    <main class="workspace" id="main" tabindex="-1">
      <header class="topbar">
        <div>
          <h1>${data.title}</h1>
          <p>${data.subtitle}</p>
        </div>
        <div class="status-lockup" aria-label="Current gate">
          <span>${data.gate}</span>
          <strong>${data.scope}</strong>
        </div>
      </header>

      <section class="overview-grid" id="overview" aria-labelledby="overview-title">
        <div class="section-kicker" id="overview-title">Operating overview</div>
        <div class="health-grid">
          ${data.healthCards
            .map(
              (card) => `
                <article class="health-card ${card.tone}">
                  <span>${card.label}</span>
                  <strong>${card.value}</strong>
                  <p>${card.detail}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="dashboard-grid" aria-label="Protected decision loop and boundary">
        <article class="panel loop-panel" aria-labelledby="loop-title">
          <div class="panel-heading">
            <div>
              <h2 id="loop-title">Protected Loop</h2>
              <p>Every step remains evidence-first and risk-gated.</p>
            </div>
            <span class="panel-chip">read-only</span>
          </div>
          <ol class="loop-list">
            ${data.loopSteps
              .map(
                (step, index) => `
                  <li>
                    <span class="step-index">${String(index + 1).padStart(2, "0")}</span>
                    <span>${step}</span>
                    <small>research control</small>
                  </li>
                `
              )
              .join("")}
          </ol>
        </article>

        <article class="panel boundary-panel" aria-labelledby="boundary-title">
          <div class="panel-heading">
            <div>
              <h2 id="boundary-title">Blocked Scope</h2>
              <p>No product breadth beyond trust in the loop.</p>
            </div>
          </div>
          <ul class="boundary-list">
            ${data.boundaryItems
              .map((item) => `<li><span aria-hidden="true"></span>${item}</li>`)
              .join("")}
          </ul>
        </article>
      </section>

      <section class="lower-grid">
        <article class="panel evidence-panel wide-panel" id="evidence" aria-labelledby="evidence-title">
          <div class="panel-heading">
            <div>
              <h2 id="evidence-title">Evidence Freshness</h2>
              <p>Latest local and remote operating signals, with limitations nearby.</p>
            </div>
            <span class="panel-chip">latest ${data.latestPacket}</span>
          </div>
          <div class="table-wrap">
            <table>
              <caption>
                Gate 2 planning signals shown by the local command center.
              </caption>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Signal</th>
                  <th>State</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                ${data.evidenceRows
                  .map(
                    (row) => `
                      <tr>
                        <td data-label="Area">${row.area}</td>
                        <td data-label="Signal">${row.signal}</td>
                        <td data-label="State"><span class="state-pill">${row.state}</span></td>
                        <td data-label="Reference">${row.reference}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel limitation-panel" id="limitations" aria-labelledby="limitations-title">
          <div class="panel-heading">
            <div>
              <h2 id="limitations-title">Limitations</h2>
              <p>Boundaries that keep evidence from becoming permission.</p>
            </div>
          </div>
          <ul class="insight-list">
            ${data.limitationItems
              .map(
                (item) => `
                  <li>
                    <strong>${item.label}</strong>
                    <span>${item.detail}</span>
                  </li>
                `
              )
              .join("")}
          </ul>
        </article>

        <article class="panel risk-panel" id="risk" aria-labelledby="risk-title">
          <div class="panel-heading">
            <div>
              <h2 id="risk-title">Risk Review</h2>
              <p>Read-only control checks that prevent accidental action semantics.</p>
            </div>
          </div>
          <ul class="insight-list risk-list">
            ${data.riskItems
              .map(
                (item) => `
                  <li>
                    <strong>${item.label}</strong>
                    <span>${item.detail}</span>
                  </li>
                `
              )
              .join("")}
          </ul>
        </article>

        <article class="panel workflow-panel" id="workflow" aria-labelledby="workflow-title">
          <div class="panel-heading">
            <div>
              <h2 id="workflow-title">Manual Workflow</h2>
              <p>Operator-owned review state without action controls.</p>
            </div>
          </div>
          <ol class="workflow-list">
            ${data.workflowItems
              .map(
                (item, index) => `
                  <li>
                    <span class="workflow-index">${String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>${item.step}</strong>
                      <span>${item.state}</span>
                      <p>${item.detail}</p>
                    </div>
                  </li>
                `
              )
              .join("")}
          </ol>
        </article>

        <article class="panel next-panel" aria-labelledby="next-title">
          <div class="panel-heading">
            <div>
              <h2 id="next-title">Next Review</h2>
              <p>Current operating notes for the local shell.</p>
            </div>
          </div>
          <ul class="action-list">
            ${data.nextActions.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>

        <article class="panel docs-panel wide-panel" id="docs" aria-labelledby="docs-title">
          <div class="panel-heading">
            <div>
              <h2 id="docs-title">Source Links</h2>
              <p>Local artifacts behind this read-only surface.</p>
            </div>
          </div>
          <div class="doc-stack">
            ${data.docGroups
              .map(
                (group) => `
                  <section class="doc-group" aria-label="${group.label} source links">
                    <div class="doc-group-heading">
                      <h3>${group.label}</h3>
                      <span>${group.items.length} refs</span>
                    </div>
                    ${group.items.map((doc) => `<code>${doc}</code>`).join("")}
                  </section>
                `
              )
              .join("")}
          </div>
        </article>
      </section>
    </main>
  </div>
`;

  updateActiveNavigation();
}

async function refreshRuntimeData() {
  try {
    const response = await fetch(runtimeDataUrl, { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    renderCommandCenter(mergeRuntimeData(commandCenterData, await response.json()));
  } catch {
    // Static file usage keeps the checked-in command center data.
  }
}

function mergeRuntimeData(baseData, runtimeData) {
  const mergedData = window.structuredClone
    ? window.structuredClone(baseData)
    : JSON.parse(JSON.stringify(baseData));
  const acceptedRecords = Number(runtimeData.acceptedRecords);
  const evidenceRecords = Number(runtimeData.evidenceRecords);

  mergedData.latestPacket = runtimeData.latestPacket;
  mergedData.localVerification = runtimeData.localVerification;
  mergedData.ciRun = runtimeData.ciRun;
  mergedData.ciState = runtimeData.ciState;
  mergedData.lastVerifiedCommit = runtimeData.lastVerifiedCommit;

  updateHealthCard(
    mergedData,
    "Local Verification",
    `Latest suite: ${runtimeData.localVerification}.`
  );
  updateHealthCard(mergedData, "Review Coverage", `${acceptedRecords} / ${acceptedRecords}`);
  updateEvidenceRow(mergedData, "Local verification", runtimeData.localVerification);
  updateEvidenceRow(
    mergedData,
    "Verified commit",
    `Run ${runtimeData.ciRun}`,
    runtimeData.lastVerifiedCommit
  );
  updateEvidenceRow(mergedData, "Remote CI", "Recorded passing run", `Run ${runtimeData.ciRun}`);
  updateEvidenceRow(mergedData, "CI evidence", `${evidenceRecords} evidence records`);
  updateEvidenceRow(mergedData, "Review coverage", `${acceptedRecords} accepted records`);

  return mergedData;
}

window.addEventListener("hashchange", updateActiveNavigation);

function slug(value) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function updateActiveNavigation() {
  const navLinks = [...document.querySelectorAll(".nav-list a[data-section]")];
  const currentSection = window.location.hash.replace("#", "") || "overview";

  for (const link of navLinks) {
    const isCurrent = link.dataset.section === currentSection;

    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function updateHealthCard(data, label, value) {
  const card = data.healthCards.find((candidate) => candidate.label === label);

  if (!card) {
    return;
  }

  if (label === "Review Coverage") {
    card.value = value;
    return;
  }

  card.detail = value;
}

function updateEvidenceRow(data, area, reference, signal) {
  const row = data.evidenceRows.find((candidate) => candidate.area === area);

  if (!row) {
    return;
  }

  if (signal) {
    row.signal = signal;
  }

  row.reference = reference;
}
