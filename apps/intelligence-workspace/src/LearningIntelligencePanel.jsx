import React from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

export function LearningIntelligencePanel({ proof }) {
  if (!proof) return null;
  const report = proof.report;

  return (
    <Panel className="learning-intelligence-panel">
      <PanelHeading
        eyebrow="Local Epoch 4 fixture"
        title="Deterministic learning intelligence"
        aside={<Badge tone="warning">{label(report.status)}</Badge>}
      />

      <div className="learning-summary-grid">
        <LearningMetric label="Source cases" value={proof.sourceCaseCount} />
        <LearningMetric
          label="Recurring invalidations"
          value={report.recurringInvalidations.length}
        />
        <LearningMetric label="Exact clusters" value={report.comparableCaseClusters.length} />
        <LearningMetric label="Drift inspection" value={label(report.driftInspection.status)} />
      </div>

      <div className="learning-pattern-grid">
        <section className="learning-section" aria-labelledby="learning-invalidations">
          <h3 id="learning-invalidations">Recurring invalidations</h3>
          <div className="learning-list">
            {report.recurringInvalidations.map((pattern) => (
              <LearningRow
                key={pattern.invalidationCode}
                title={label(pattern.invalidationCode)}
                detail={`${pattern.occurrenceCount} linked cases`}
                evidence={pattern.caseRecordIds}
              />
            ))}
          </div>
        </section>

        <section className="learning-section" aria-labelledby="learning-failures">
          <h3 id="learning-failures">Evidence and failure modes</h3>
          <div className="learning-list">
            {report.evidenceFailurePatterns.map((pattern) => (
              <LearningRow
                key={`${pattern.failureMode}:${pattern.evidenceCombination.join(":")}`}
                title={label(pattern.failureMode)}
                detail={pattern.evidenceCombination.map(label).join(" · ")}
                evidence={pattern.caseRecordIds}
              />
            ))}
          </div>
        </section>

        <section className="learning-section" aria-labelledby="learning-process">
          <h3 id="learning-process">Manual process attribution</h3>
          <div className="learning-list">
            {report.operatorProcessPatterns.map((pattern) => (
              <LearningRow
                key={pattern.processError}
                title={label(pattern.processError)}
                detail={`${pattern.occurrenceCount} operator-confirmed cases`}
                evidence={pattern.caseRecordIds}
              />
            ))}
          </div>
          <small className="learning-section__boundary">
            Attribution is manual and local. The system does not infer operator intent.
          </small>
        </section>

        <section className="learning-section" aria-labelledby="learning-clusters">
          <h3 id="learning-clusters">Comparable case clusters</h3>
          <div className="learning-list">
            {report.comparableCaseClusters.map((cluster) => (
              <LearningRow
                key={cluster.clusterId}
                title={`${label(cluster.regime)} · ${cluster.caseRecordIds.length} cases`}
                detail={`${cluster.evidenceCombination.map(label).join(" · ")} | ${cluster.dispositions.map(label).join(" / ")}`}
                evidence={cluster.caseRecordIds}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="learning-drift">
        <div>
          <span>Version and regime inspection</span>
          <strong>
            {report.driftInspection.strategyVersions.length} strategy versions ·{" "}
            {report.driftInspection.regimeChangeCount} regime changes
          </strong>
        </div>
        <Badge tone="warning">{label(report.driftInspection.status)}</Badge>
        <p>{report.driftInspection.reasons.join(" ")}</p>
      </div>

      <div className="learning-limitations">
        <strong>Interpretation limits</strong>
        {report.limitations.map((limitation) => (
          <p key={limitation}>{limitation}</p>
        ))}
      </div>
    </Panel>
  );
}

function LearningMetric({ label: metricLabel, value }) {
  return (
    <div>
      <span>{metricLabel}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LearningRow({ title, detail, evidence }) {
  return (
    <div className="learning-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <small>{evidence.join(" · ")}</small>
    </div>
  );
}

function label(value) {
  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
