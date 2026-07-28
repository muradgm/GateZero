import React from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

export function MultiStrategyPanel({ proof }) {
  if (!proof) return null;

  return (
    <Panel className="multi-strategy-panel">
      <PanelHeading
        eyebrow="Local Epoch 5 fixture"
        title="Multi-strategy protected loop"
        aside={<Badge tone="success">{proof.checkpoint.status}</Badge>}
      />

      <div className="multi-strategy-summary">
        <Metric label="Registered strategies" value={proof.registrations.length} />
        <Metric label="Complete traces" value={proof.checkpoint.completeLifecycleCount} />
        <Metric
          label="Identity isolation"
          value={proof.checkpoint.identityIsolated ? "Verified" : "Blocked"}
        />
        <Metric
          label="Shared controls"
          value={proof.checkpoint.protectedLoopShared ? "Verified" : "Blocked"}
        />
      </div>

      <div className="multi-strategy-list">
        {proof.registrations.map((registration) => {
          const assessment = proof.assessments.find(
            ({ assessment: candidate }) => candidate.strategyId === registration.strategyId
          )?.assessment;
          const lifecycle = proof.lifecycles.find(
            (candidate) => candidate.strategyId === registration.strategyId
          );

          return (
            <section className="multi-strategy-row" key={registration.strategyId}>
              <div>
                <span>{strategyLabel(registration.strategyId)}</span>
                <strong>
                  {registration.strategyId} · v{registration.strategyVersion}
                </strong>
                <small>
                  {registration.requiredGates.length} declared gates ·{" "}
                  {registration.observationEngineVersion}
                </small>
              </div>
              <div className="multi-strategy-status">
                <Badge
                  tone={lifecycle?.trace.lifecycleStatus === "COMPLETE" ? "success" : "warning"}
                >
                  {lifecycle?.trace.lifecycleStatus ?? "BLOCKED"}
                </Badge>
                <small>
                  Assessment {assessment?.recommendation?.replaceAll("_", " ") ?? "unavailable"}
                </small>
              </div>
            </section>
          );
        })}
      </div>

      <div className="multi-strategy-boundary">
        <strong>Interpretation boundary</strong>
        {proof.limitations.map((limitation) => (
          <p key={limitation}>{limitation}</p>
        ))}
      </div>
    </Panel>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function strategyLabel(strategyId) {
  return strategyId === "EURUSD_LONDON_RANGE_BREAKOUT"
    ? "London range breakout"
    : "London-New York overlap pullback";
}
