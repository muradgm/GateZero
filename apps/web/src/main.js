import { commandCenterData } from "./command-center-data.js";

/* global document */

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing command center mount node.");
}

app.innerHTML = `
  <div class="shell">
    <aside class="sidebar" aria-label="Command center navigation">
      <div class="brand">
        <div class="brand-mark">GZ</div>
        <div>
          <div class="brand-name">${commandCenterData.project}</div>
          <div class="brand-subtitle">Command Center</div>
        </div>
      </div>
      <nav class="nav-list">
        ${commandCenterData.navItems
          .map(
            (item, index) =>
              `<a class="${index === 0 ? "active" : ""}" href="#${slug(item)}">${item}</a>`
          )
          .join("")}
      </nav>
      <div class="rail-note">
        <span class="note-label">Operating scope</span>
        <strong>${commandCenterData.scope}</strong>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <h1>${commandCenterData.title}</h1>
          <p>${commandCenterData.subtitle}</p>
        </div>
        <div class="status-lockup" aria-label="Current gate">
          <span>${commandCenterData.gate}</span>
          <strong>${commandCenterData.scope}</strong>
        </div>
      </header>

      <section class="health-grid" id="overview" aria-label="Gate 0 health">
        ${commandCenterData.healthCards
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
      </section>

      <section class="dashboard-grid">
        <article class="panel loop-panel" id="evidence">
          <div class="panel-heading">
            <div>
              <h2>Protected Loop</h2>
              <p>Every step remains evidence-first and risk-gated.</p>
            </div>
            <span class="panel-chip">read-only</span>
          </div>
          <ol class="loop-list">
            ${commandCenterData.loopSteps
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

        <article class="panel boundary-panel" id="risk">
          <div class="panel-heading">
            <div>
              <h2>Risk Boundary</h2>
              <p>No product breadth beyond trust in the loop.</p>
            </div>
          </div>
          <ul class="boundary-list">
            ${commandCenterData.boundaryItems
              .map((item) => `<li><span aria-hidden="true"></span>${item}</li>`)
              .join("")}
          </ul>
        </article>
      </section>

      <section class="lower-grid">
        <article class="panel evidence-panel" id="ci">
          <div class="panel-heading">
            <div>
              <h2>Evidence Freshness</h2>
              <p>Latest local and remote operating signals.</p>
            </div>
            <span class="panel-chip">latest ${commandCenterData.latestPacket}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Signal</th>
                  <th>State</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                ${commandCenterData.evidenceRows
                  .map(
                    (row) => `
                      <tr>
                        <td>${row.area}</td>
                        <td>${row.signal}</td>
                        <td><span class="state-pill">${row.state}</span></td>
                        <td>${row.reference}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel action-panel" id="docs">
          <div class="panel-heading">
            <div>
              <h2>Next Action</h2>
              <p>Maintenance posture and source links.</p>
            </div>
          </div>
          <ul class="action-list">
            ${commandCenterData.nextActions.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <div class="doc-stack">
            ${commandCenterData.docs.map((doc) => `<code>${doc}</code>`).join("")}
          </div>
        </article>
      </section>
    </main>
  </div>
`;

function slug(value) {
  return value.toLowerCase().replaceAll(" ", "-");
}
