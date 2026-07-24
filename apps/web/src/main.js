import { commandCenterData } from "./command-center-data.js";

/* global document, fetch, setInterval, window */

const app = document.querySelector("#app");
const runtimeDataUrl = "/runtime/command-center-data.json";
const runtimeRefreshMs = 15_000;
let selectedIntelligenceCaseId = "";

if (!app) {
  throw new Error("Missing command center mount node.");
}

renderCommandCenter(commandCenterData);
void refreshRuntimeData();
setInterval(() => {
  void refreshRuntimeData();
}, runtimeRefreshMs);

function renderCommandCenter(data) {
  const simulationEvidenceDetail = normalizeSimulationEvidenceDetail(data.simulationEvidenceDetail);
  const strategyReviewWorkspace = normalizeStrategyReviewWorkspace(data.strategyReviewWorkspace);
  const marketIntelligenceWorkspace = normalizeMarketIntelligenceWorkspace(
    data.marketIntelligenceWorkspace
  );

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
        <a href="./simulator.html">Simulator Evidence</a>
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
          <section class="evidence-detail" aria-labelledby="evidence-detail-title">
            <div class="detail-heading">
              <div>
                <h3 id="evidence-detail-title">${simulationEvidenceDetail.title}</h3>
                <p>${simulationEvidenceDetail.summary}</p>
              </div>
              <span class="state-pill">${simulationEvidenceDetail.status}</span>
            </div>
            <div class="detail-grid">
              ${renderDetailCard("Core Records", [
                ["Detail", simulationEvidenceDetail.recordId],
                ["Simulation", simulationEvidenceDetail.simulationRecordId],
                ["State", simulationEvidenceDetail.stateRecordId],
                ["Operator", simulationEvidenceDetail.operatorRecordId],
                ["Risk", simulationEvidenceDetail.riskRecordId],
                ["Assumption", simulationEvidenceDetail.assumptionRecordId]
              ])}
              ${renderListCard("Boundary Checks", simulationEvidenceDetail.boundaryChecks)}
              ${renderListCard("Workflow Evidence", simulationEvidenceDetail.workflowRefs)}
              ${renderListCard("Risk References", simulationEvidenceDetail.riskRefs)}
              ${renderListCard("Artifact Summary", simulationEvidenceDetail.artifactRefs)}
              ${renderListCard("Failure-Mode Evidence", simulationEvidenceDetail.failureModeRefs)}
              ${renderListCard("Source Link Map", simulationEvidenceDetail.sourceLinkRefs)}
              ${renderListCard("Local Source Artifacts", simulationEvidenceDetail.sourceArtifacts)}
            </div>
            <div class="detail-adjacency" aria-label="Evidence limitations and reproducibility">
              <section aria-labelledby="reproducibility-notes-title">
                <h3 id="reproducibility-notes-title">Reproducibility Notes</h3>
                <ul>
                  ${renderPlainListItems(simulationEvidenceDetail.reproducibilityNotes)}
                </ul>
              </section>
              <section aria-labelledby="evidence-detail-limitations-title">
                <h3 id="evidence-detail-limitations-title">Limitations</h3>
                <ul>
                  ${renderPlainListItems(simulationEvidenceDetail.limitationNotes)}
                </ul>
              </section>
            </div>
            <section class="detail-control-plane" aria-labelledby="evidence-controls-title">
              <div class="detail-control-heading">
                <h3 id="evidence-controls-title">Evidence Controls</h3>
                <p>Local guardrails for source mapping, review posture, and display boundaries.</p>
              </div>
              <div class="detail-grid">
                ${renderListCard("Runtime Snapshot Map", simulationEvidenceDetail.runtimeSnapshotRefs)}
                ${renderListCard("Fixture Drift Checks", simulationEvidenceDetail.fixtureDriftChecks)}
                ${renderListCard("Review Aging Policy", simulationEvidenceDetail.reviewAgingPolicy)}
                ${renderListCard("Operator Scan Checklist", simulationEvidenceDetail.operatorScanChecklist)}
                ${renderListCard("Artifact Retention", simulationEvidenceDetail.artifactRetentionNotes)}
                ${renderListCard("Failure Taxonomy", simulationEvidenceDetail.failureTaxonomy)}
                ${renderListCard("Display Policy", simulationEvidenceDetail.displayPolicies)}
                ${renderListCard("Performance Smoke", simulationEvidenceDetail.performanceSmokeChecks)}
              </div>
              <div class="detail-grid detail-grid-compact" aria-label="Evidence control follow-up checks">
                ${renderListCard("Visual Density", simulationEvidenceDetail.visualDensityChecks)}
                ${renderListCard("Accessibility Recheck", simulationEvidenceDetail.accessibilityRecheck)}
                ${renderListCard("Copy Minimization", simulationEvidenceDetail.copyMinimizationRules)}
                ${renderListCard("Source Freshness Plan", simulationEvidenceDetail.sourceFreshnessPlan)}
                ${renderListCard("Artifact Inventory Plan", simulationEvidenceDetail.artifactInventoryPlan)}
                ${renderListCard("Operator Note Model", simulationEvidenceDetail.operatorNoteModelPlan)}
                ${renderListCard("Limitation Prominence", simulationEvidenceDetail.limitationProminenceChecks)}
                ${renderListCard("Source Compaction", simulationEvidenceDetail.sourceCompactionPlan)}
                ${renderListCard("Output Channel Boundary", simulationEvidenceDetail.outputChannelBoundary)}
                ${renderListCard("Control Lane Checkpoint", simulationEvidenceDetail.controlLaneCheckpoint)}
              </div>
            </section>
          </section>
        </article>

        <article class="panel workspace-panel wide-panel" id="workspace" aria-labelledby="workspace-title">
          <div class="panel-heading">
            <div>
              <h2 id="workspace-title">${strategyReviewWorkspace.title}</h2>
              <p>${strategyReviewWorkspace.coreQuestion}</p>
            </div>
            <span class="panel-chip">${strategyReviewWorkspace.status}</span>
          </div>
          <div class="workspace-case-summary">
            <span>Research case</span>
            <strong>${strategyReviewWorkspace.researchCaseId}</strong>
          </div>
          <div class="workspace-evidence-grid">
            ${
              strategyReviewWorkspace.evidenceChain.length > 0
                ? strategyReviewWorkspace.evidenceChain
                    .map(
                      (item, index) => `
                  <section class="workspace-step" aria-labelledby="workspace-step-${index}-title">
                    <div class="workspace-step-index">${String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 id="workspace-step-${index}-title">${item.label}</h3>
                      <code>${item.ref}</code>
                      <p>${item.limitation}</p>
                    </div>
                  </section>
                `
                    )
                    .join("")
                : renderEmptyState("Research evidence", "No local research evidence recorded.")
            }
          </div>
          <div class="workspace-adjacency" aria-label="Workspace supporting evidence and limitations">
            ${renderListCard("Artifact Inventory", strategyReviewWorkspace.artifactInventory)}
            ${renderListCard("Market Intelligence", strategyReviewWorkspace.marketIntelligence)}
            ${renderListCard("Blocked Scope Reminder", strategyReviewWorkspace.blockedScopeReminder)}
          </div>
          <section class="market-workspace" aria-labelledby="generated-backtest-title">
            <div class="detail-heading">
              <div>
                <h3 id="generated-backtest-title">${strategyReviewWorkspace.backtestRunEvidence.title}</h3>
                <p>Generated locally from checked-in candles and a frozen reference strategy.</p>
              </div>
              <span class="state-pill">${strategyReviewWorkspace.backtestRunEvidence.status}</span>
            </div>
            <div class="market-grid">
              ${renderRecordCard(
                "Backtest Run",
                strategyReviewWorkspace.backtestRunEvidence.runId,
                [
                  ["Run", strategyReviewWorkspace.backtestRunEvidence.runId],
                  ["Engine", strategyReviewWorkspace.backtestRunEvidence.engineVersion],
                  ["Instrument", strategyReviewWorkspace.backtestRunEvidence.instrument],
                  [
                    "Observations",
                    String(strategyReviewWorkspace.backtestRunEvidence.observationCount)
                  ],
                  [
                    "Closed trades",
                    String(strategyReviewWorkspace.backtestRunEvidence.closedTradeCount)
                  ],
                  [
                    "Reproducibility",
                    strategyReviewWorkspace.backtestRunEvidence.reproducibilityStatus
                  ]
                ]
              )}
              ${renderListCard(
                "Backtest Limitations",
                strategyReviewWorkspace.backtestRunEvidence.limitations
              )}
              ${renderListCard("Frozen Hashes", [
                `Input: ${strategyReviewWorkspace.backtestRunEvidence.inputHash}`,
                `Output: ${strategyReviewWorkspace.backtestRunEvidence.outputHash}`
              ])}
            </div>
          </section>
          <section class="market-workspace intelligence-brief" aria-labelledby="intelligence-brief-title">
            <div class="detail-heading">
              <div>
                <h3 id="intelligence-brief-title">Read-Only Intelligence Brief</h3>
                <p>One balanced, source-linked local scenario brief. Evidence for review, never an instruction.</p>
              </div>
              <span class="state-pill">${marketIntelligenceWorkspace.intelligenceBrief.status}</span>
            </div>
            <div class="brief-case-selector">
              <label for="intelligence-brief-case">Local research case</label>
              <select id="intelligence-brief-case">
                ${marketIntelligenceWorkspace.intelligenceBrief.caseSelection.options
                  .map(
                    (option) =>
                      `<option value="${option.caseId}">${option.title} — ${option.status}</option>`
                  )
                  .join("")}
              </select>
              <div class="brief-availability" id="intelligence-brief-availability" role="status" aria-live="polite"></div>
            </div>
            <div class="brief-identity" data-brief-detail aria-label="Intelligence brief identity">
              <div>
                <span>Brief</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.briefId}</strong>
              </div>
              <div>
                <span>Research case</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.researchCaseId}</strong>
              </div>
              <div>
                <span>Generated</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.generatedAt}</strong>
              </div>
            </div>
            <div class="brief-grid" data-brief-detail aria-label="Local source inventory">
              ${marketIntelligenceWorkspace.intelligenceBrief.sources
                .map(
                  (source) => `
                    <section class="brief-card">
                      <div class="brief-card-heading">
                        <div>
                          <span>Local source</span>
                          <h4>${source.title}</h4>
                        </div>
                        <span class="state-pill">${source.freshness}</span>
                      </div>
                      <code>${source.repositoryRef}</code>
                      <dl class="compact-definition-list">
                        <dt>As of</dt>
                        <dd>${source.asOf}</dd>
                      </dl>
                      <p>${source.limitation}</p>
                    </section>
                  `
                )
                .join("")}
            </div>
            <div class="brief-grid" data-brief-detail aria-label="Separate timeframe evidence">
              ${marketIntelligenceWorkspace.intelligenceBrief.timeframes
                .map(
                  (timeframe) => `
                    <section class="brief-card">
                      <div class="brief-card-heading">
                        <div>
                          <span>${timeframe.timeframe} evidence</span>
                          <h4>${timeframe.summary}</h4>
                        </div>
                        <span class="state-pill">${timeframe.confidence} confidence</span>
                      </div>
                      ${renderListBlock("Supporting evidence", timeframe.supportingEvidence)}
                      ${renderListBlock("Counter-evidence", timeframe.counterEvidence)}
                      ${renderListBlock("Red flags", timeframe.redFlags)}
                      ${renderListBlock("Invalidation", timeframe.invalidationConditions)}
                      ${renderListBlock("Limitations", timeframe.limitations)}
                    </section>
                  `
                )
                .join("")}
            </div>
            <div class="brief-scenario-grid" data-brief-detail aria-label="Balanced conditional scenarios">
              ${marketIntelligenceWorkspace.intelligenceBrief.scenarios
                .map((scenario) => renderBriefScenarioCard(scenario))
                .join("")}
            </div>
            <div class="workspace-adjacency" data-brief-detail aria-label="Brief review requirements and limitations">
              ${renderListCard("Cross-Timeframe Conflicts", marketIntelligenceWorkspace.intelligenceBrief.crossTimeframeConflicts)}
              ${renderListCard("Brief Limitations", marketIntelligenceWorkspace.intelligenceBrief.limitations)}
              ${renderListCard("Blocked Scope", marketIntelligenceWorkspace.intelligenceBrief.blockedScopeReminder)}
            </div>
            <div class="brief-review-strip" data-brief-detail>
              <div>
                <span>Evidence quality</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.qualityStatus}</strong>
              </div>
              <div>
                <span>Semantic safety</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.semanticSafetyStatus}</strong>
              </div>
              <div>
                <span>Adversarial review</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.adversarialStatus}</strong>
              </div>
              <div>
                <span>Risk review required</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.riskReviewStatus}</strong>
              </div>
              <div>
                <span>Operator decision required</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.operatorDecisionStatus}</strong>
              </div>
            </div>
            <div class="brief-grid" data-brief-detail aria-label="Brief evidence links and provenance">
              ${renderRecordCard(
                "Historical Backtest Link",
                marketIntelligenceWorkspace.intelligenceBrief.backtestLink.id,
                [
                  ["Run", marketIntelligenceWorkspace.intelligenceBrief.backtestLink.runId],
                  [
                    "Relationship",
                    marketIntelligenceWorkspace.intelligenceBrief.backtestLink.relationship
                  ],
                  [
                    "Evidence permission",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.backtestLink.evidencePermission
                    )
                  ]
                ]
              )}
              ${renderListCard(
                "Source Provenance",
                marketIntelligenceWorkspace.intelligenceBrief.provenance.map(
                  (source) => `${source.sourceId}: ${source.status} — ${source.payloadHash}`
                )
              )}
              ${renderRecordCard(
                "Conflict Review",
                marketIntelligenceWorkspace.intelligenceBrief.conflictPanel.status,
                [
                  ["Status", marketIntelligenceWorkspace.intelligenceBrief.conflictPanel.status],
                  [
                    "Conflicts",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.conflictPanel.conflicts.length
                    )
                  ],
                  [
                    "Operator message",
                    marketIntelligenceWorkspace.intelligenceBrief.conflictPanel.operatorMessage
                  ]
                ]
              )}
            </div>
            <div class="brief-grid" data-brief-detail aria-label="Invalidation and manual review records">
              ${renderRecordCard(
                "Explicit Invalidation Evaluation",
                marketIntelligenceWorkspace.intelligenceBrief.invalidationEvaluation.id,
                [
                  [
                    "Invocation",
                    marketIntelligenceWorkspace.intelligenceBrief.invalidationEvaluation.invocation
                  ],
                  [
                    "Disposition",
                    marketIntelligenceWorkspace.intelligenceBrief.invalidationEvaluation.disposition
                  ],
                  [
                    "Checks",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.invalidationEvaluation.checks
                        .length
                    )
                  ]
                ]
              )}
              ${renderRecordCard(
                "Manual Risk Review",
                marketIntelligenceWorkspace.intelligenceBrief.manualRiskReview.id,
                [
                  [
                    "Disposition",
                    marketIntelligenceWorkspace.intelligenceBrief.manualRiskReview.disposition
                  ],
                  [
                    "Findings",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.manualRiskReview.findings.length
                    )
                  ],
                  [
                    "Approval granted",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.manualRiskReview.approvalGranted
                    )
                  ]
                ]
              )}
              ${renderRecordCard(
                "Operator Decision Record",
                marketIntelligenceWorkspace.intelligenceBrief.operatorDecision.id,
                [
                  [
                    "Decision",
                    marketIntelligenceWorkspace.intelligenceBrief.operatorDecision.decision
                  ],
                  ["Reason", marketIntelligenceWorkspace.intelligenceBrief.operatorDecision.reason],
                  [
                    "Simulation authorized",
                    String(
                      marketIntelligenceWorkspace.intelligenceBrief.operatorDecision
                        .simulationAuthorized
                    )
                  ]
                ]
              )}
            </div>
            <form class="manual-review-form" id="manual-review-form" data-brief-detail novalidate>
              <div class="detail-heading">
                <div>
                  <h3>Manual Local Review</h3>
                  <p>Record research-only risk and operator notes for this frozen brief.</p>
                </div>
                <span class="state-pill">local only</span>
              </div>
              <div class="manual-review-grid">
                <label>
                  Risk disposition
                  <select name="riskDisposition" required>
                    <option value="recorded_for_review">Recorded for review</option>
                    <option value="needs_revision">Needs revision</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </label>
                <label>
                  Operator decision
                  <select name="operatorDecision" required>
                    <option value="keep_research_only">Keep research-only</option>
                    <option value="revise">Revise</option>
                    <option value="reject">Reject</option>
                  </select>
                </label>
                <label>
                  Risk findings
                  <textarea name="findings" rows="3" placeholder="One finding per line"></textarea>
                </label>
                <label>
                  Limitation notes
                  <textarea name="limitations" rows="3" required placeholder="One limitation per line"></textarea>
                </label>
                <label class="manual-review-wide">
                  Decision reason
                  <textarea name="decisionReason" rows="3" required></textarea>
                </label>
              </div>
              <div class="manual-review-boundary">
                Saving records local evidence only. It grants no approval, simulation, execution, or external-dispatch authority.
              </div>
              <div class="manual-review-actions">
                <button type="submit">Save local review</button>
                <span id="manual-review-status" role="status" aria-live="polite">No authored record loaded.</span>
              </div>
            </form>
            <div class="brief-review-strip" data-brief-detail aria-label="Workflow checkpoint">
              <div>
                <span>Workflow checkpoint</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.workflowCheckpoint.id}</strong>
              </div>
              <div>
                <span>Workflow status</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.workflowCheckpoint.status}</strong>
              </div>
              <div>
                <span>Next material gap</span>
                <strong>${marketIntelligenceWorkspace.intelligenceBrief.workflowCheckpoint.nextGap}</strong>
              </div>
            </div>
            <div class="brief-hash" data-brief-detail>
              <span>Frozen brief hash</span>
              <code>${marketIntelligenceWorkspace.intelligenceBrief.contentHash}</code>
            </div>
          </section>
          <section class="market-workspace" aria-labelledby="market-workspace-title">
            <div class="detail-heading">
              <div>
                <h3 id="market-workspace-title">${marketIntelligenceWorkspace.title}</h3>
                <p>${marketIntelligenceWorkspace.summary}</p>
              </div>
              <span class="state-pill">${marketIntelligenceWorkspace.status}</span>
            </div>
            <div class="market-grid">
              ${renderRecordCard("Scenario Draft", marketIntelligenceWorkspace.recommendation.id, [
                ["Record", marketIntelligenceWorkspace.recommendation.id],
                [
                  "Candidate disposition",
                  marketIntelligenceWorkspace.recommendation.candidateDisposition
                ],
                ["Status", marketIntelligenceWorkspace.recommendation.status],
                ["Confidence", marketIntelligenceWorkspace.recommendation.confidence],
                ["Candidate", marketIntelligenceWorkspace.recommendation.candidate],
                ["Red Flag", marketIntelligenceWorkspace.recommendation.redFlag]
              ])}
              ${renderRecordCard("Risk-Gated Review", marketIntelligenceWorkspace.riskReview.id, [
                ["Record", marketIntelligenceWorkspace.riskReview.id],
                ["Status", marketIntelligenceWorkspace.riskReview.status],
                ["Disposition", marketIntelligenceWorkspace.riskReview.disposition],
                ["Risk Review", marketIntelligenceWorkspace.riskReview.riskReview]
              ])}
              ${renderRecordCard(
                "Local Simulation Candidate",
                marketIntelligenceWorkspace.simulationCandidate.id,
                [
                  ["Record", marketIntelligenceWorkspace.simulationCandidate.id],
                  ["Status", marketIntelligenceWorkspace.simulationCandidate.status],
                  ["Simulation", marketIntelligenceWorkspace.simulationCandidate.simulationRecord],
                  [
                    "Evidence Detail",
                    marketIntelligenceWorkspace.simulationCandidate.evidenceDetail
                  ]
                ]
              )}
            </div>
            <div class="market-grid market-grid-wide" aria-label="Market intelligence supporting records">
              ${renderListCard("Scenario Evidence", marketIntelligenceWorkspace.recommendation.evidenceRefs)}
              ${renderListCard("Scenario Sources", marketIntelligenceWorkspace.recommendation.sourceRefs)}
              ${renderListCard("Scenario Limitations", marketIntelligenceWorkspace.recommendation.limitationNotes)}
              ${renderListCard("Risk Review Notes", marketIntelligenceWorkspace.riskReview.notes)}
              ${renderListCard("Blocker References", marketIntelligenceWorkspace.riskReview.blockerRefs)}
              ${renderListCard("Candidate Boundary Checks", marketIntelligenceWorkspace.simulationCandidate.boundaryChecks)}
              ${renderListCard("Candidate Limitations", marketIntelligenceWorkspace.simulationCandidate.limitationNotes)}
              ${renderListCard("Blocker Checkpoint", marketIntelligenceWorkspace.blockerCheckpoint)}
            </div>
            <div class="market-source-groups" aria-label="Market intelligence sources by purpose">
              ${marketIntelligenceWorkspace.sourceGroups
                .map(
                  (group) => `
                    <section class="market-source-group" aria-labelledby="${slug(group.label)}-source-group-title">
                      <div>
                        <h4 id="${slug(group.label)}-source-group-title">${group.label}</h4>
                        <p>${group.purpose}</p>
                      </div>
                      <ul>${renderCodeListItems(group.refs)}</ul>
                    </section>
                  `
                )
                .join("")}
            </div>
            <div class="inventory-table-wrap">
              <table>
                <caption>
                  Local artifact inventory records supporting the research case.
                </caption>
                <thead>
                  <tr>
                    <th>Artifact</th>
                    <th>Type</th>
                    <th>Freshness</th>
                    <th>Local path</th>
                    <th>Limitation</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    marketIntelligenceWorkspace.artifactInventory.length > 0
                      ? marketIntelligenceWorkspace.artifactInventory
                          .map(
                            (artifact) => `
                        <tr>
                          <td data-label="Artifact">${artifact.id}</td>
                          <td data-label="Type">${artifact.type}</td>
                          <td data-label="Freshness"><span class="state-pill">${artifact.freshness}</span></td>
                          <td data-label="Local path"><code>${artifact.path}</code></td>
                          <td data-label="Limitation">${artifact.limitation}</td>
                        </tr>
                      `
                          )
                          .join("")
                      : `<tr><td class="empty-detail" colspan="5">No local artifacts recorded.</td></tr>`
                  }
                </tbody>
              </table>
            </div>
            <div class="operator-note-card" aria-labelledby="operator-note-title">
              <h3 id="operator-note-title">Operator Note</h3>
              ${
                marketIntelligenceWorkspace.operatorNote.id
                  ? `
                    <strong>${marketIntelligenceWorkspace.operatorNote.id}</strong>
                    <p>${marketIntelligenceWorkspace.operatorNote.body}</p>
                    <div class="workspace-adjacency">
                      ${renderListCard("Manual Note Sources", marketIntelligenceWorkspace.operatorNote.sources)}
                      ${renderListCard("Manual Note Limitations", marketIntelligenceWorkspace.operatorNote.limitationNotes)}
                    </div>
                  `
                  : '<p class="empty-detail">No local operator note recorded.</p>'
              }
            </div>
          </section>
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
          <div class="source-review-grid" aria-label="Source overflow review">
            ${data.sourceOverflowReview
              .map(
                (item) => `
                  <article class="source-review-card">
                    <strong>${item.label}</strong>
                    <span>${item.detail}</span>
                  </article>
                `
              )
              .join("")}
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
  bindIntelligenceBriefCaseSelector(marketIntelligenceWorkspace.intelligenceBrief);
  bindManualReviewAuthoring(marketIntelligenceWorkspace.intelligenceBrief);
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
  const preservedDetail = normalizeSimulationEvidenceDetail(baseData.simulationEvidenceDetail);
  const preservedStrategyWorkspace = normalizeStrategyReviewWorkspace(
    baseData.strategyReviewWorkspace
  );
  const preservedMarketWorkspace = normalizeMarketIntelligenceWorkspace(
    baseData.marketIntelligenceWorkspace
  );
  const acceptedRecords = Number(runtimeData.acceptedRecords);
  const evidenceRecords = Number(runtimeData.evidenceRecords);

  mergedData.latestPacket = runtimeData.latestPacket;
  mergedData.localVerification = runtimeData.localVerification;
  mergedData.ciRun = runtimeData.ciRun;
  mergedData.ciState = runtimeData.ciState;
  mergedData.lastVerifiedCommit = runtimeData.lastVerifiedCommit;
  mergedData.simulationEvidenceDetail = preservedDetail;
  mergedData.strategyReviewWorkspace = preservedStrategyWorkspace;
  mergedData.marketIntelligenceWorkspace = preservedMarketWorkspace;

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

window.addEventListener("hashchange", () => {
  updateActiveNavigation();
  focusHashTarget();
});

function slug(value) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function renderDetailCard(title, rows) {
  return `
    <section class="detail-card" aria-labelledby="${slug(title)}-detail-card-title">
      <h3 id="${slug(title)}-detail-card-title">${title}</h3>
      <dl>
        ${rows
          .map(
            ([label, value]) => `
              <div>
                <dt>${label}</dt>
                <dd>${value || "Not recorded in local detail."}</dd>
              </div>
            `
          )
          .join("")}
      </dl>
    </section>
  `;
}

function renderRecordCard(title, recordId, rows) {
  if (!recordId) {
    return renderEmptyState(title, `No local ${title.toLowerCase()} recorded.`);
  }

  return renderDetailCard(title, rows);
}

function renderEmptyState(title, detail) {
  return `
    <section class="detail-card empty-state" aria-labelledby="${slug(title)}-empty-state-title">
      <h3 id="${slug(title)}-empty-state-title">${title}</h3>
      <p>${detail}</p>
      <small>Local workspace only.</small>
    </section>
  `;
}

function renderListCard(title, items) {
  return `
    <section class="detail-card" aria-labelledby="${slug(title)}-detail-card-title">
      <h3 id="${slug(title)}-detail-card-title">${title}</h3>
      <ul>
        ${renderCodeListItems(items)}
      </ul>
    </section>
  `;
}

function renderCodeListItems(items) {
  const safeItems = asList(items);

  if (safeItems.length === 0) {
    return '<li class="empty-detail">No local references recorded.</li>';
  }

  return safeItems.map((item) => `<li><code>${item}</code></li>`).join("");
}

function renderPlainListItems(items) {
  const safeItems = asList(items);

  if (safeItems.length === 0) {
    return '<li class="empty-detail">No local notes recorded.</li>';
  }

  return safeItems.map((item) => `<li>${item}</li>`).join("");
}

function normalizeSimulationEvidenceDetail(detail = {}) {
  return {
    title: detail.title || "Simulation Evidence Detail",
    summary:
      detail.summary ||
      "Local evidence detail for the Gate 2 paper-simulation planning lane. This is a display record only.",
    status: detail.status || "Not recorded",
    recordId: detail.recordId || "",
    simulationRecordId: detail.simulationRecordId || "",
    stateRecordId: detail.stateRecordId || "",
    operatorRecordId: detail.operatorRecordId || "",
    riskRecordId: detail.riskRecordId || "",
    assumptionRecordId: detail.assumptionRecordId || "",
    workflowRefs: asList(detail.workflowRefs),
    riskRefs: asList(detail.riskRefs),
    artifactRefs: asList(detail.artifactRefs),
    failureModeRefs: asList(detail.failureModeRefs),
    sourceLinkRefs: asList(detail.sourceLinkRefs),
    sourceArtifacts: asList(detail.sourceArtifacts),
    runtimeSnapshotRefs: asList(detail.runtimeSnapshotRefs),
    fixtureDriftChecks: asList(detail.fixtureDriftChecks),
    reviewAgingPolicy: asList(detail.reviewAgingPolicy),
    operatorScanChecklist: asList(detail.operatorScanChecklist),
    artifactRetentionNotes: asList(detail.artifactRetentionNotes),
    failureTaxonomy: asList(detail.failureTaxonomy),
    displayPolicies: asList(detail.displayPolicies),
    performanceSmokeChecks: asList(detail.performanceSmokeChecks),
    visualDensityChecks: asList(detail.visualDensityChecks),
    accessibilityRecheck: asList(detail.accessibilityRecheck),
    copyMinimizationRules: asList(detail.copyMinimizationRules),
    sourceFreshnessPlan: asList(detail.sourceFreshnessPlan),
    artifactInventoryPlan: asList(detail.artifactInventoryPlan),
    operatorNoteModelPlan: asList(detail.operatorNoteModelPlan),
    limitationProminenceChecks: asList(detail.limitationProminenceChecks),
    sourceCompactionPlan: asList(detail.sourceCompactionPlan),
    outputChannelBoundary: asList(detail.outputChannelBoundary),
    controlLaneCheckpoint: asList(detail.controlLaneCheckpoint),
    reproducibilityNotes: asList(detail.reproducibilityNotes),
    limitationNotes: asList(detail.limitationNotes),
    boundaryChecks: asList(detail.boundaryChecks)
  };
}

function normalizeStrategyReviewWorkspace(workspace = {}) {
  return {
    title: workspace.title || "Strategy Review Workspace",
    status: workspace.status || "Not recorded",
    researchCaseId: workspace.researchCaseId || "",
    coreQuestion:
      workspace.coreQuestion ||
      "Can the operator inspect the full evidence chain for one research case?",
    backtestRunEvidence: normalizeBacktestRunEvidence(workspace.backtestRunEvidence),
    evidenceChain: Array.isArray(workspace.evidenceChain)
      ? workspace.evidenceChain
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            label: typeof item.label === "string" ? item.label : "Evidence",
            ref: typeof item.ref === "string" ? item.ref : "Not recorded in local workspace.",
            limitation:
              typeof item.limitation === "string"
                ? item.limitation
                : "No local limitation recorded."
          }))
      : [],
    artifactInventory: asList(workspace.artifactInventory),
    marketIntelligence: asList(workspace.marketIntelligence),
    blockedScopeReminder: asList(workspace.blockedScopeReminder)
  };
}

function normalizeMarketIntelligenceWorkspace(workspace = {}) {
  return {
    title: workspace.title || "Market Intelligence Workspace",
    status: workspace.status || "Not recorded",
    summary:
      workspace.summary ||
      "Sourced local market context is shown as scenario evidence, not action authority.",
    intelligenceBrief: normalizeIntelligenceBrief(workspace.intelligenceBrief),
    recommendation: normalizeScenarioRecommendation(workspace.recommendation),
    riskReview: normalizeRecommendationRiskReview(workspace.riskReview),
    simulationCandidate: normalizeSimulationCandidate(workspace.simulationCandidate),
    artifactInventory: Array.isArray(workspace.artifactInventory)
      ? workspace.artifactInventory
          .filter((artifact) => artifact && typeof artifact === "object")
          .map((artifact) => ({
            id: typeof artifact.id === "string" ? artifact.id : "Not recorded",
            type: typeof artifact.type === "string" ? artifact.type : "Not recorded",
            path: typeof artifact.path === "string" ? artifact.path : "Not recorded",
            freshness: typeof artifact.freshness === "string" ? artifact.freshness : "Not recorded",
            limitation:
              typeof artifact.limitation === "string" ? artifact.limitation : "Not recorded"
          }))
      : [],
    operatorNote: normalizeOperatorNote(workspace.operatorNote),
    blockerCheckpoint: asList(workspace.blockerCheckpoint),
    sourceGroups: Array.isArray(workspace.sourceGroups)
      ? workspace.sourceGroups
          .filter((group) => group && typeof group === "object")
          .map((group) => ({
            label: typeof group.label === "string" ? group.label : "Local sources",
            purpose:
              typeof group.purpose === "string"
                ? group.purpose
                : "Checked-in evidence for local inspection.",
            refs: asList(group.refs)
          }))
      : []
  };
}

function normalizeIntelligenceBrief(brief = {}) {
  const normalizeEvidenceItem = (item = {}) => ({
    timeframe: item.timeframe || "Not recorded",
    summary: item.summary || "No local evidence summary recorded.",
    confidence: item.confidence || "not_recorded",
    supportingEvidence: asList(item.supportingEvidence),
    counterEvidence: asList(item.counterEvidence),
    redFlags: asList(item.redFlags),
    invalidationConditions: asList(item.invalidationConditions),
    limitations: asList(item.limitations)
  });

  return {
    briefId: brief.briefId || "",
    researchCaseId: brief.researchCaseId || "",
    status: brief.status || "unavailable",
    generatedAt: brief.generatedAt || "",
    contentHash: brief.contentHash || "",
    sources: Array.isArray(brief.sources)
      ? brief.sources
          .filter((source) => source && typeof source === "object")
          .map((source) => ({
            title: source.title || "Local source",
            repositoryRef: source.repositoryRef || "Not recorded",
            freshness: source.freshness || "unknown",
            asOf: source.asOf || "Not recorded",
            limitation: source.limitation || "No local limitation recorded."
          }))
      : [],
    timeframes: Array.isArray(brief.timeframes)
      ? brief.timeframes
          .filter((item) => item && typeof item === "object")
          .map(normalizeEvidenceItem)
      : [],
    scenarios: Array.isArray(brief.scenarios)
      ? brief.scenarios
          .filter((scenario) => scenario && typeof scenario === "object")
          .map((scenario) => ({
            direction: scenario.direction || "conditional",
            title: scenario.title || "Conditional scenario",
            conditions: asList(scenario.conditions),
            supportingEvidence: asList(scenario.supportingEvidence),
            counterEvidence: asList(scenario.counterEvidence),
            redFlags: asList(scenario.redFlags),
            invalidationConditions: asList(scenario.invalidationConditions),
            limitations: asList(scenario.limitations),
            confidence: scenario.confidence || "not_recorded"
          }))
      : [],
    qualityStatus: brief.qualityStatus || "not_recorded",
    semanticSafetyStatus: brief.semanticSafetyStatus || "not_recorded",
    adversarialStatus: brief.adversarialStatus || "not_recorded",
    crossTimeframeConflicts: asList(brief.crossTimeframeConflicts),
    limitations: asList(brief.limitations),
    riskReviewStatus: brief.riskReviewStatus || "required",
    operatorDecisionStatus: brief.operatorDecisionStatus || "required",
    blockedScopeReminder: asList(brief.blockedScopeReminder),
    caseSelection: {
      selectedCaseId: brief.caseSelection?.selectedCaseId || "",
      options: Array.isArray(brief.caseSelection?.options)
        ? brief.caseSelection.options
            .filter((option) => option && typeof option === "object")
            .map((option) => ({
              caseId: option.caseId || "",
              title: option.title || "Local research case",
              status: option.status || "unavailable",
              reason: option.reason || "no_linked_brief",
              message: option.message || "No local intelligence brief is available."
            }))
        : []
    },
    backtestLink: {
      id: brief.backtestLink?.id || "",
      runId: brief.backtestLink?.runId || "",
      relationship: brief.backtestLink?.relationship || "",
      inputHash: brief.backtestLink?.inputHash || "",
      outputHash: brief.backtestLink?.outputHash || "",
      evidencePermission: brief.backtestLink?.evidencePermission === true
    },
    provenance: Array.isArray(brief.provenance)
      ? brief.provenance
          .filter((source) => source && typeof source === "object")
          .map((source) => ({
            sourceId: source.sourceId || "",
            payloadHash: source.payloadHash || "",
            status: source.status || "unverified",
            notes: asList(source.notes)
          }))
      : [],
    conflictPanel: {
      status: brief.conflictPanel?.status || "revision_required",
      conflicts: asList(brief.conflictPanel?.conflicts),
      operatorMessage: brief.conflictPanel?.operatorMessage || "Conflict evidence is unavailable."
    },
    invalidationEvaluation: {
      id: brief.invalidationEvaluation?.id || "",
      invocation: brief.invalidationEvaluation?.invocation || "explicit_operator_request",
      disposition: brief.invalidationEvaluation?.disposition || "blocked",
      checks: Array.isArray(brief.invalidationEvaluation?.checks)
        ? brief.invalidationEvaluation.checks
        : []
    },
    manualRiskReview: {
      id: brief.manualRiskReview?.id || "",
      disposition: brief.manualRiskReview?.disposition || "blocked",
      findings: asList(brief.manualRiskReview?.findings),
      limitations: asList(brief.manualRiskReview?.limitations),
      approvalGranted: brief.manualRiskReview?.approvalGranted === true
    },
    operatorDecision: {
      id: brief.operatorDecision?.id || "",
      decision: brief.operatorDecision?.decision || "revise",
      reason: brief.operatorDecision?.reason || "No manual operator decision recorded.",
      simulationAuthorized: brief.operatorDecision?.simulationAuthorized === true
    },
    workflowCheckpoint: {
      id: brief.workflowCheckpoint?.id || "",
      status: brief.workflowCheckpoint?.status || "not_recorded",
      nextGap: brief.workflowCheckpoint?.nextGap || "not_recorded"
    }
  };
}

function bindIntelligenceBriefCaseSelector(brief) {
  const selector = document.querySelector("#intelligence-brief-case");
  const availability = document.querySelector("#intelligence-brief-availability");
  const detailNodes = [...document.querySelectorAll("[data-brief-detail]")];

  if (!selector || !availability) {
    return;
  }

  const availableIds = new Set(brief.caseSelection.options.map((option) => option.caseId));
  const preferredId = availableIds.has(selectedIntelligenceCaseId)
    ? selectedIntelligenceCaseId
    : brief.caseSelection.selectedCaseId;
  selector.value = preferredId;

  const update = () => {
    selectedIntelligenceCaseId = selector.value;
    const selected = brief.caseSelection.options.find(
      (option) => option.caseId === selectedIntelligenceCaseId
    );
    const isAvailable = selected?.status === "available";

    availability.className = `brief-availability ${selected?.status || "unavailable"}`;
    availability.innerHTML = `
      <strong>${selected?.status || "unavailable"}</strong>
      <span>${selected?.message || "No local intelligence brief is available."}</span>
      <code>${selected?.reason || "no_linked_brief"}</code>
    `;

    for (const node of detailNodes) {
      node.hidden = !isAvailable;
    }
  };

  selector.addEventListener("change", update);
  update();
}

function bindManualReviewAuthoring(brief) {
  const form = document.querySelector("#manual-review-form");
  const status = document.querySelector("#manual-review-status");
  if (!form || !status) return;

  const storageKey = `traderframe.manual-review.v1.${brief.briefId}`;
  const lines = (value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  const setStatus = (message, state = "neutral") => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const populate = (record) => {
    form.elements.riskDisposition.value = record.risk_review.disposition;
    form.elements.operatorDecision.value = record.operator_decision.decision;
    form.elements.findings.value = record.risk_review.findings.join("\n");
    form.elements.limitations.value = record.risk_review.limitation_notes.join("\n");
    form.elements.decisionReason.value = record.operator_decision.reason;
  };

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const record = JSON.parse(raw);
      if (
        record.schema_version !== 1 ||
        record.brief_id !== brief.briefId ||
        record.brief_content_sha256 !== brief.contentHash ||
        record.execution_authorized !== false ||
        record.external_dispatch !== false ||
        record.risk_review?.approval_granted !== false ||
        record.operator_decision?.simulation_authorized !== false
      ) {
        throw new Error("Stored record does not match the frozen local brief.");
      }
      populate(record);
      setStatus(`Recovered validated local revision ${record.revision}.`, "recovered");
    }
  } catch {
    setStatus("Stored review is blocked and was not loaded. Re-enter the review.", "blocked");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const findings = lines(form.elements.findings.value);
    const limitations = lines(form.elements.limitations.value);
    const decisionReason = form.elements.decisionReason.value.trim();
    const riskDisposition = form.elements.riskDisposition.value;

    if (
      limitations.length === 0 ||
      decisionReason.length === 0 ||
      (riskDisposition !== "recorded_for_review" && findings.length === 0)
    ) {
      setStatus(
        "Review not saved. Add limitations, a decision reason, and findings for blocked or revision states.",
        "blocked"
      );
      return;
    }

    let revision = 1;
    let createdAt = new Date().toISOString();
    try {
      const existing = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (existing?.brief_content_sha256 === brief.contentHash) {
        revision = Number(existing.revision || 0) + 1;
        createdAt = existing.created_at || createdAt;
      }
    } catch {
      revision = 1;
    }

    const updatedAt = new Date().toISOString();
    const boundary = {
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      local_only: true,
      read_only: true,
      evidence_only: true,
      operator_required: true,
      risk_review_required: true,
      external_access: false,
      execution_path: false,
      action_route_created: false,
      recommendation_final: false,
      approval_claim: false,
      performance_claim: false
    };
    const riskReviewId = `manual-risk-review-${revision}`;
    const riskReview = {
      ...boundary,
      risk_review_id: riskReviewId,
      brief_id: brief.briefId,
      brief_content_sha256: brief.contentHash,
      reviewer_role: "operator_risk_reviewer",
      review_mode: "manual_local",
      disposition: riskDisposition,
      findings,
      limitation_notes: limitations,
      approval_granted: false,
      reviewed_at: updatedAt
    };
    const operatorDecision = {
      ...boundary,
      operator_decision_id: `manual-operator-decision-${revision}`,
      brief_id: brief.briefId,
      risk_review_id: riskReviewId,
      decision: form.elements.operatorDecision.value,
      reason: decisionReason,
      evidence_refs: [brief.briefId, riskReviewId],
      decision_mode: "manual_local",
      simulation_authorized: false,
      decided_at: updatedAt
    };
    const record = {
      ...boundary,
      authoring_record_id: `manual-review-authoring-${revision}`,
      schema_version: 1,
      linked_research_case_id: brief.researchCaseId,
      brief_id: brief.briefId,
      brief_content_sha256: brief.contentHash,
      authoring_mode: "manual_local",
      record_status: "validated_local_record",
      revision,
      risk_review: riskReview,
      operator_decision: operatorDecision,
      created_at: createdAt,
      updated_at: updatedAt,
      execution_authorized: false,
      external_dispatch: false
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(record));
      setStatus(`Saved validated local revision ${revision}. No authority was granted.`, "saved");
    } catch {
      setStatus("Local storage failed. The review was not saved.", "blocked");
    }
  });
}

function renderBriefScenarioCard(scenario) {
  return `
    <section class="brief-card brief-scenario">
      <div class="brief-card-heading">
        <div>
          <span>${scenario.direction} conditional scenario</span>
          <h4>${scenario.title}</h4>
        </div>
        <span class="state-pill">${scenario.confidence} confidence</span>
      </div>
      ${renderListBlock("Conditions", scenario.conditions)}
      <div class="brief-evidence-pair">
        ${renderListBlock("Supporting evidence", scenario.supportingEvidence)}
        ${renderListBlock("Counter-evidence", scenario.counterEvidence)}
      </div>
      ${renderListBlock("Red flags", scenario.redFlags)}
      ${renderListBlock("Invalidation", scenario.invalidationConditions)}
      ${renderListBlock("Limitations", scenario.limitations)}
    </section>
  `;
}

function renderListBlock(label, items) {
  return `
    <div class="brief-list-block">
      <h5>${label}</h5>
      ${
        items.length > 0
          ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
          : '<p class="empty-detail">None recorded.</p>'
      }
    </div>
  `;
}

function normalizeScenarioRecommendation(recommendation = {}) {
  return {
    id: recommendation.id || "",
    candidateDisposition: recommendation.candidateDisposition || "",
    status: recommendation.status || "",
    confidence: recommendation.confidence || "",
    candidate: recommendation.candidate || "",
    redFlag: recommendation.redFlag || "",
    evidenceRefs: asList(recommendation.evidenceRefs),
    sourceRefs: asList(recommendation.sourceRefs),
    limitationNotes: asList(recommendation.limitationNotes)
  };
}

function normalizeBacktestRunEvidence(evidence = {}) {
  return {
    title: evidence.title || "Generated Historical Backtest Evidence",
    runId: evidence.runId || "",
    resultId: evidence.resultId || "",
    status: evidence.status || "Unavailable",
    engineVersion: evidence.engineVersion || "",
    instrument: evidence.instrument || "",
    observationCount: Number.isFinite(evidence.observationCount) ? evidence.observationCount : 0,
    closedTradeCount: Number.isFinite(evidence.closedTradeCount) ? evidence.closedTradeCount : 0,
    declaredCostsApplied: evidence.declaredCostsApplied === true,
    reproducibilityStatus: evidence.reproducibilityStatus || "not_checked",
    inputHash: evidence.inputHash || "",
    outputHash: evidence.outputHash || "",
    limitations: asList(evidence.limitations)
  };
}

function normalizeRecommendationRiskReview(review = {}) {
  return {
    id: review.id || "",
    status: review.status || "",
    disposition: review.disposition || "",
    riskReview: review.riskReview || "",
    blockerRefs: asList(review.blockerRefs),
    notes: asList(review.notes)
  };
}

function normalizeSimulationCandidate(candidate = {}) {
  return {
    id: candidate.id || "",
    status: candidate.status || "",
    simulationRecord: candidate.simulationRecord || "",
    evidenceDetail: candidate.evidenceDetail || "",
    boundaryChecks: asList(candidate.boundaryChecks),
    limitationNotes: asList(candidate.limitationNotes)
  };
}

function normalizeOperatorNote(note = {}) {
  return {
    id: note.id || "",
    type: note.type || "",
    body: note.body || "No manual note recorded.",
    sources: asList(note.sources),
    limitationNotes: asList(note.limitationNotes)
  };
}

function asList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item) : [];
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

function focusHashTarget() {
  const targetId = window.location.hash.replace("#", "");

  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
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
