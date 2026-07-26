import React from "react";
import { deriveCandidateWorkflow } from "./candidate-workflow.js";
import { LifecycleRail } from "./LifecycleRail.jsx";

const toneByStatus = {
  READY: "ready",
  BLOCKED: "blocked",
  PENDING: "pending",
  CLOSED: "closed"
};

export function CandidateActionBar({ candidate, generatedAt }) {
  const workflow = deriveCandidateWorkflow(candidate, generatedAt);
  const tone = toneByStatus[workflow.status] ?? "pending";
  const expiry = workflow.expiresAt
    ? formatUtc(workflow.expiresAt)
    : workflow.status === "CLOSED"
      ? "Closed"
      : "Not declared";

  return (
    <div className="candidate-workflow-stack">
      <section
        className={`candidate-action-bar candidate-action-bar--${tone}`}
        aria-label="Candidate workflow status"
      >
        <div className="candidate-action-bar__identity">
          <span className="candidate-action-bar__eyebrow">Current workflow</span>
          <strong>{workflow.currentStageLabel}</strong>
          <small>
            {candidate.instrument} · {workflow.statusLabel}
          </small>
        </div>

        <div className="candidate-action-bar__item candidate-action-bar__item--blocker">
          <span>Blocking condition</span>
          <strong>{workflow.blockingCondition}</strong>
        </div>

        <div className="candidate-action-bar__item candidate-action-bar__item--action">
          <span>Next required action</span>
          <strong>{workflow.nextAction}</strong>
        </div>

        <div className="candidate-action-bar__meta">
          <div>
            <span>Freshness</span>
            <strong>{workflow.freshnessLabel}</strong>
          </div>
          <div>
            <span>Expiry</span>
            <strong>{expiry}</strong>
          </div>
        </div>
      </section>

      <LifecycleRail pipeline={candidate.pipeline} workflow={workflow} />
    </div>
  );
}

function formatUtc(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid";
  return `${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  })} UTC`;
}
