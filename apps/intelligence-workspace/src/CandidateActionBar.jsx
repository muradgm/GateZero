import React from "react";
import { LifecycleRail } from "./LifecycleRail.jsx";

const toneByStatus = {
  READY: "ready",
  BLOCKED: "blocked",
  PENDING: "pending",
  CLOSED: "closed"
};

const stageLabels = {
  research_case: "Candidate intake",
  market_context: "Context review",
  evidence_assessment: "Evidence review",
  setup_review: "Setup review",
  intelligence_report: "Assessment review",
  risk_review: "Risk review",
  operator_decision: "Operator decision",
  paper_simulation: "Paper simulation",
  outcome: "Outcome review",
  learning: "Learning review"
};

export function CandidateActionBar({ candidate, generatedAt }) {
  const workflow = candidate.workflow ?? deriveWorkflow(candidate, generatedAt);
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
          <small>{candidate.instrument} · {workflow.statusLabel}</small>
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

function deriveWorkflow(candidate, generatedAt) {
  const recommendation = candidate.report.recommendation;
  const stage = candidate.pipeline.currentStage;
  const downgrade = candidate.report.downgradeReasons[0];
  const pendingStage = stageLabels[stage] ?? stage.replaceAll("_", " ");
  const lastEvent = candidate.report.timeline.at(-1)?.occurredAt ?? generatedAt;

  if (recommendation === "REJECT") {
    return {
      status: "CLOSED",
      statusLabel: "Rejected",
      currentStageLabel: pendingStage,
      blockingCondition: downgrade ?? candidate.report.bearCase.summary,
      nextAction: "Preserve the rejection rationale and close the review trace.",
      freshnessLabel: freshnessLabel(lastEvent, generatedAt)
    };
  }

  if (recommendation === "PAPER_SIMULATE") {
    return {
      status: stage === "operator_decision" ? "READY" : "PENDING",
      statusLabel: stage === "operator_decision" ? "Ready for decision" : "Review in progress",
      currentStageLabel: pendingStage,
      blockingCondition: downgrade ?? "No unresolved assessment blocker recorded.",
      nextAction:
        stage === "risk_review"
          ? "Complete risk review before recording the operator decision."
          : "Review the evidence and record the bounded operator decision.",
      freshnessLabel: freshnessLabel(lastEvent, generatedAt),
      expiresAt: addMinutes(lastEvent, 60)
    };
  }

  return {
    status: "BLOCKED",
    statusLabel: "Watch",
    currentStageLabel: pendingStage,
    blockingCondition: downgrade ?? firstContradiction(candidate),
    nextAction: nextActionForWatch(candidate),
    freshnessLabel: freshnessLabel(lastEvent, generatedAt),
    expiresAt: addMinutes(lastEvent, 120)
  };
}

function firstContradiction(candidate) {
  return (
    candidate.report.contributions.find((item) => item.direction === "contradicting")?.rationale ??
    "A required condition remains unresolved."
  );
}

function nextActionForWatch(candidate) {
  const contradiction = candidate.report.contributions.find((item) => item.direction === "contradicting");
  if (contradiction?.dimension === "macro" || contradiction?.dimension === "event_risk") {
    return "Wait for the event-risk restriction to clear, then refresh the context.";
  }
  if (contradiction?.dimension === "momentum") {
    return "Wait for momentum and location to improve before reassessment.";
  }
  return "Resolve the first contradictory condition and rerun the assessment.";
}

function freshnessLabel(observedAt, generatedAt) {
  const observed = Date.parse(observedAt);
  const generated = Date.parse(generatedAt);
  if (!Number.isFinite(observed) || !Number.isFinite(generated)) return "Unknown";
  const ageMinutes = Math.max(0, Math.round((generated - observed) / 60000));
  if (ageMinutes <= 5) return "Fresh";
  if (ageMinutes <= 30) return `${ageMinutes}m old`;
  return `Stale · ${ageMinutes}m`;
}

function addMinutes(value, minutes) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time + minutes * 60000).toISOString() : undefined;
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
